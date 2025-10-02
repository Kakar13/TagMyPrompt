import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getFormatterSystemPrompt, validatePromptForFormatting, type FormattingStyle } from "@/lib/prompts/formatter-system-prompt";

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey, style = 'standard' } = await request.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate prompt and provide guidance
    const validation = validatePromptForFormatting(prompt);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: validation.message }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    
    if (!key) {
      return new Response(
        JSON.stringify({ error: "API key not provided" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const anthropic = new Anthropic({ apiKey: key });

    // Get the enhanced system prompt based on formatting style
    const systemPrompt = getFormatterSystemPrompt(style as FormattingStyle);

    const stream = await anthropic.messages.stream({
      model: "claude-sonnet-4-5-20250929", // Using Claude Sonnet 4.5 for best results
      max_tokens: 4096,
      temperature: 0.3, // Slightly higher for more natural formatting choices
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Create a ReadableStream for Server-Sent Events
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
              const data = `data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          // Send final message with usage stats and validation info
          const finalMessage = await stream.finalMessage();
          const usageData = `data: ${JSON.stringify({ 
            done: true, 
            usage: {
              inputTokens: finalMessage.usage.input_tokens,
              outputTokens: finalMessage.usage.output_tokens,
            },
            validation: validation.message ? { 
              message: validation.message, 
              suggestion: validation.suggestion 
            } : undefined
          })}\n\n`;
          controller.enqueue(encoder.encode(usageData));
          
          controller.close();
        } catch (error) {
          console.error("Stream error:", error);
          controller.error(error);
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error: any) {
    console.error("Format prompt stream error:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to format prompt" }),
      { 
        status: error.status || 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}


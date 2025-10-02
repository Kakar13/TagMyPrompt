import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
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

    const stream = await anthropic.messages.stream({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 4096,
      temperature: 0,
      system: `Analyze this prompt and enhance it with proper XML structure and Markdown formatting following Anthropic's context engineering best practices. 

Add relevant tags like <instructions>, <examples>, <context>, <thinking>, <output>, <constraints> where appropriate. 

Organize content with clear sections using Markdown headers (##) where helpful.

Preserve the user's intent but improve structure and clarity. Focus on:
- Minimal high-signal tokens
- Clear, organized sections
- Proper XML tag hierarchy
- Effective use of Markdown formatting

Return ONLY the formatted prompt without any explanation or preamble.`,
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

          // Send final message with usage stats
          const finalMessage = await stream.finalMessage();
          const usageData = `data: ${JSON.stringify({ 
            done: true, 
            usage: {
              inputTokens: finalMessage.usage.input_tokens,
              outputTokens: finalMessage.usage.output_tokens,
            }
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


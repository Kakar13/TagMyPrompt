import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: NextRequest) {
  try {
    const { prompt, apiKey } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    // Use provided API key or environment variable
    const key = apiKey || process.env.ANTHROPIC_API_KEY;
    
    if (!key) {
      return NextResponse.json(
        { error: "API key not provided" },
        { status: 401 }
      );
    }

    const anthropic = new Anthropic({ apiKey: key });

    const message = await anthropic.messages.create({
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

    const formattedPrompt = message.content[0].type === "text" 
      ? message.content[0].text 
      : "";

    return NextResponse.json({
      formattedPrompt,
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error: any) {
    console.error("Format prompt error:", error);
    
    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }
    
    if (error.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to format prompt" },
      { status: 500 }
    );
  }
}


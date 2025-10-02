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
      max_tokens: 1024,
      temperature: 0,
      system: `Analyze this prompt and suggest which XML tags would be most beneficial to structure it properly.

Available tags: <instructions>, <context>, <examples>, <constraints>, <thinking>, <analysis>, <output>, <background_information>, <rules>, <tools>

For each suggested tag, explain WHY it would be useful (1-2 sentences).

CRITICAL: You must return ONLY valid JSON, with NO additional text, explanation, or markdown formatting.

Return your response in exactly this JSON format:
{
  "suggestions": [
    {
      "tag": "instructions",
      "reason": "The prompt needs clear guidelines on..."
    }
  ]
}

Do not wrap the JSON in markdown code blocks. Return raw JSON only.`,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.content[0].type === "text" 
      ? message.content[0].text 
      : "";

    // Try to parse JSON, handling potential markdown wrapping
    let suggestions;
    try {
      // Remove potential markdown code blocks
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      suggestions = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("JSON parse error, raw content:", content);
      // Fallback: return empty suggestions
      suggestions = { suggestions: [] };
    }

    return NextResponse.json({
      suggestions: suggestions.suggestions || [],
      usage: {
        inputTokens: message.usage.input_tokens,
        outputTokens: message.usage.output_tokens,
      },
    });
  } catch (error: any) {
    console.error("Suggest tags error:", error);
    
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
      { error: error.message || "Failed to suggest tags" },
      { status: 500 }
    );
  }
}


import { Tiktoken, getEncoding } from "js-tiktoken";

let encoder: Tiktoken | null = null;

export function initTokenizer() {
  if (!encoder) {
    try {
      encoder = getEncoding("cl100k_base");
    } catch (error) {
      console.error("Failed to initialize tokenizer:", error);
    }
  }
  return encoder;
}

export function countTokens(text: string): number {
  try {
    const enc = initTokenizer();
    if (!enc) return estimateTokens(text);
    
    const tokens = enc.encode(text);
    return tokens.length;
  } catch (error) {
    console.error("Error counting tokens:", error);
    return estimateTokens(text);
  }
}

// Fallback estimation: ~4 characters per token
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function getTokenStats(text: string): {
  tokens: number;
  characters: number;
  words: number;
  lines: number;
} {
  return {
    tokens: countTokens(text),
    characters: text.length,
    words: text.split(/\s+/).filter(Boolean).length,
    lines: text.split("\n").length,
  };
}


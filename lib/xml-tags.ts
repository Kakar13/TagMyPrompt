import { XMLTag } from "./types";

export const DEFAULT_XML_TAGS: XMLTag[] = [
  {
    name: "instructions",
    description: "Main instructions and guidelines for the AI",
    example: "<instructions>\nYour task is to...\n</instructions>",
  },
  {
    name: "context",
    description: "Background information and context",
    example: "<context>\nThe user is working on...\n</context>",
  },
  {
    name: "examples",
    description: "Few-shot examples to guide behavior",
    example: "<examples>\n<example>\nInput: ...\nOutput: ...\n</example>\n</examples>",
  },
  {
    name: "constraints",
    description: "Limitations and boundaries",
    example: "<constraints>\n- Must use Python 3.10+\n- Maximum 500 words\n</constraints>",
  },
  {
    name: "thinking",
    description: "Section for reasoning and analysis",
    example: "<thinking>\nLet me analyze this step by step...\n</thinking>",
  },
  {
    name: "analysis",
    description: "Detailed analysis section",
    example: "<analysis>\nKey factors to consider:\n1. ...\n</analysis>",
  },
  {
    name: "output",
    description: "Expected output format and structure",
    example: "<output>\nProvide the result in the following format:\n...\n</output>",
  },
  {
    name: "background_information",
    description: "Additional background context",
    example: "<background_information>\nRelevant history and context...\n</background_information>",
  },
  {
    name: "rules",
    description: "Specific rules to follow",
    example: "<rules>\n1. Always validate input\n2. Handle errors gracefully\n</rules>",
  },
  {
    name: "tools",
    description: "Available tools and their usage",
    example: "<tools>\nYou have access to:\n- search(query)\n- calculate(expression)\n</tools>",
  },
];

export function validateXML(content: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const stack: string[] = [];
  
  // Simple regex to find XML tags
  const tagRegex = /<\/?([a-zA-Z_][\w-]*)\s*>/g;
  let match;
  
  while ((match = tagRegex.exec(content)) !== null) {
    const fullTag = match[0];
    const tagName = match[1];
    
    if (fullTag.startsWith("</")) {
      // Closing tag
      if (stack.length === 0) {
        errors.push(`Unexpected closing tag: </${tagName}>`);
      } else {
        const lastTag = stack.pop();
        if (lastTag !== tagName) {
          errors.push(`Tag mismatch: expected </${lastTag}>, found </${tagName}>`);
        }
      }
    } else {
      // Opening tag
      stack.push(tagName);
    }
  }
  
  // Check for unclosed tags
  if (stack.length > 0) {
    stack.forEach((tag) => {
      errors.push(`Unclosed tag: <${tag}>`);
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function extractTags(content: string): string[] {
  const tags = new Set<string>();
  const tagRegex = /<([a-zA-Z_][\w-]*)\s*>/g;
  let match;
  
  while ((match = tagRegex.exec(content)) !== null) {
    tags.add(match[1]);
  }
  
  return Array.from(tags);
}

export function formatXML(content: string): string {
  let formatted = content;
  let indent = 0;
  const lines: string[] = [];
  
  // Split by tags while preserving them
  const parts = formatted.split(/(<\/?[^>]+>)/g);
  
  parts.forEach((part) => {
    if (!part.trim()) return;
    
    if (part.match(/^<\/\w+>$/)) {
      // Closing tag
      indent = Math.max(0, indent - 2);
      lines.push(" ".repeat(indent) + part);
    } else if (part.match(/^<\w+>$/)) {
      // Opening tag
      lines.push(" ".repeat(indent) + part);
      indent += 2;
    } else {
      // Content
      lines.push(" ".repeat(indent) + part.trim());
    }
  });
  
  return lines.join("\n");
}


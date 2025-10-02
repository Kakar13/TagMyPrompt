"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface PromptPreviewProps {
  content: string;
}

export function PromptPreview({ content }: PromptPreviewProps) {
  const renderContent = () => {
    // Split content by XML tags and render with syntax highlighting
    const parts = content.split(/(<\/?[^>]+>)/g);
    
    return parts.map((part, idx) => {
      if (part.match(/^<\/?\w+>$/)) {
        // XML tag
        return (
          <span key={idx} className="text-blue-400 font-mono">
            {part}
          </span>
        );
      } else if (part.match(/^#{1,6}\s/m)) {
        // Markdown header
        const level = part.match(/^#{1,6}/)?.[0].length || 1;
        const text = part.replace(/^#{1,6}\s/, "");
        return (
          <div
            key={idx}
            className={cn(
              "font-bold mt-4 mb-2",
              level === 1 && "text-2xl",
              level === 2 && "text-xl",
              level === 3 && "text-lg"
            )}
          >
            {text}
          </div>
        );
      } else {
        // Regular text - preserve formatting
        return (
          <span key={idx} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      }
    });
  };

  return (
    <div className="h-full border rounded-lg bg-muted/30 p-6 overflow-y-auto">
      <div className="prose prose-sm max-w-none dark:prose-invert">
        <div className="font-mono text-sm leading-relaxed">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}


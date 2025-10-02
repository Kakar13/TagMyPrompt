"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tag, Sparkles } from "lucide-react";

interface TagSuggestion {
  tag: string;
  reason: string;
}

interface TagSuggestionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: TagSuggestion[];
  onInsertTag: (tag: string) => void;
}

export function TagSuggestionsModal({
  open,
  onOpenChange,
  suggestions,
  onInsertTag,
}: TagSuggestionsModalProps) {
  const handleInsert = (tag: string) => {
    onInsertTag(`<${tag}>\n\n</${tag}>`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Suggested XML Tags
          </DialogTitle>
          <DialogDescription>
            AI-recommended tags to improve your prompt structure
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {suggestions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No suggestions available</p>
            </div>
          ) : (
            suggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <code className="text-sm font-mono text-primary font-semibold">
                      &lt;{suggestion.tag}&gt;
                    </code>
                    <p className="text-sm text-muted-foreground mt-2">
                      {suggestion.reason}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleInsert(suggestion.tag)}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            Click "Insert" to add a tag pair to your prompt
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


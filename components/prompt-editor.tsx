"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { validateXML } from "@/lib/xml-tags";
import { getTokenStats } from "@/lib/tokenizer";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface PromptEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PromptEditor({ value, onChange }: PromptEditorProps) {
  const [validation, setValidation] = useState<{ isValid: boolean; errors: string[] }>({
    isValid: true,
    errors: [],
  });
  const [stats, setStats] = useState({
    tokens: 0,
    characters: 0,
    words: 0,
    lines: 0,
  });

  useEffect(() => {
    // Validate XML
    const result = validateXML(value);
    setValidation(result);

    // Update stats
    const newStats = getTokenStats(value);
    setStats(newStats);
  }, [value]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 border rounded-lg overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="xml"
          value={value}
          onChange={(val) => onChange(val || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            wordWrap: "on",
            folding: true,
            bracketPairColorization: { enabled: true },
            autoClosingBrackets: "always",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {/* Status Bar */}
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
        <div className="flex items-center gap-4">
          <span>Tokens: <strong className="text-foreground">{stats.tokens}</strong></span>
          <span>Characters: <strong className="text-foreground">{stats.characters}</strong></span>
          <span>Words: <strong className="text-foreground">{stats.words}</strong></span>
          <span>Lines: <strong className="text-foreground">{stats.lines}</strong></span>
        </div>
        
        <div className="flex items-center gap-2">
          {validation.isValid ? (
            <div className="flex items-center gap-1 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Valid XML</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-destructive">
              <AlertCircle className="h-4 w-4" />
              <span>{validation.errors.length} error{validation.errors.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>

      {/* Validation Errors */}
      {!validation.isValid && (
        <div className="mt-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
          <p className="text-sm font-medium text-destructive mb-2">XML Validation Errors:</p>
          <ul className="space-y-1">
            {validation.errors.map((error, idx) => (
              <li key={idx} className="text-xs text-destructive/90">• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


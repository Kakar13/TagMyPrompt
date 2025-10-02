"use client";

import React, { useState, useEffect } from "react";
import { PromptEditor } from "@/components/prompt-editor";
import { PromptPreview } from "@/components/prompt-preview";
import { TagPalette } from "@/components/tag-palette";
import { PromptLibrary } from "@/components/prompt-library";
import { TemplateSelector } from "@/components/template-selector";
import { SettingsModal } from "@/components/settings-modal";
import { TagSuggestionsModal } from "@/components/tag-suggestions-modal";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { savePrompt, exportData, importData } from "@/lib/storage";
import { getApiKey, hasApiKey } from "@/lib/api-key-storage";
import { Prompt } from "@/lib/types";
import {
  Save,
  FileText,
  Download,
  Upload,
  Menu,
  X,
  Home,
  LayoutTemplate,
  Sparkles,
  Tag,
  Settings,
  Undo2,
  Loader2,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function EditorPage() {
  const [content, setContent] = useState("");
  const [previousContent, setPreviousContent] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showTagSuggestionsDialog, setShowTagSuggestionsDialog] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [promptName, setPromptName] = useState("");
  const [promptDescription, setPromptDescription] = useState("");
  const [promptCategory, setPromptCategory] = useState("general");
  const [isFormatting, setIsFormatting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<Array<{ tag: string; reason: string }>>([]);
  const [hasApiKeyConfigured, setHasApiKeyConfigured] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setHasApiKeyConfigured(hasApiKey());
  }, [showSettingsDialog]);

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast.success("Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + Shift + F for AI Format
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'F') {
        e.preventDefault();
        handleAIFormat();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [content, hasApiKeyConfigured]);

  const handleSavePrompt = async () => {
    const prompt: Prompt = {
      id: currentPrompt?.id || Date.now().toString(),
      name: promptName,
      description: promptDescription,
      content,
      category: promptCategory,
      tags: [],
      createdAt: currentPrompt?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await savePrompt(prompt);
    setCurrentPrompt(prompt);
    setShowSaveDialog(false);
    toast.success("Prompt saved successfully!");
  };

  const handleSelectPrompt = (prompt: Prompt) => {
    setCurrentPrompt(prompt);
    setContent(prompt.content);
    setPromptName(prompt.name);
    setPromptDescription(prompt.description);
    setPromptCategory(prompt.category);
  };

  const handleInsertTag = (tag: string) => {
    setContent((prev) => prev + (prev ? "\n\n" : "") + tag);
  };

  const handleNewPrompt = () => {
    if (content && !confirm("Start a new prompt? Unsaved changes will be lost.")) {
      return;
    }
    setCurrentPrompt(null);
    setContent("");
    setPromptName("");
    setPromptDescription("");
    setPromptCategory("general");
  };

  const handleExport = async () => {
    const data = await exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `prompts-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const text = await file.text();
        try {
          await importData(text);
          toast.success("Data imported successfully!");
          window.location.reload();
        } catch (error) {
          toast.error("Failed to import data. Please check the file format.");
        }
      }
    };
    input.click();
  };

  const handleAIFormat = async () => {
    if (!hasApiKeyConfigured) {
      toast.error("Please configure your API key first");
      setShowSettingsDialog(true);
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content to format");
      return;
    }

    setIsFormatting(true);
    setPreviousContent(content);
    setContent(""); // Clear for streaming

    try {
      const apiKey = getApiKey();
      const response = await fetch("/api/format-prompt-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: previousContent, apiKey }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to format prompt");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let formattedText = "";
      let usageData = null;

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = JSON.parse(line.slice(6));
              
              if (data.text) {
                formattedText += data.text;
                setContent(formattedText);
              }
              
              if (data.done) {
                usageData = data.usage;
              }
            }
          }
        }
      }

      toast.success(
        usageData 
          ? `Prompt formatted! Used ${usageData.inputTokens + usageData.outputTokens} tokens`
          : "Prompt formatted!",
        {
          action: {
            label: "Undo",
            onClick: () => {
              setContent(previousContent);
              toast.success("Reverted to original");
            },
          },
        }
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to format prompt");
      setContent(previousContent); // Restore on error
      if (error.message?.includes("API key")) {
        setShowSettingsDialog(true);
      }
    } finally {
      setIsFormatting(false);
    }
  };

  const handleSuggestTags = async () => {
    if (!hasApiKeyConfigured) {
      toast.error("Please configure your API key first");
      setShowSettingsDialog(true);
      return;
    }

    if (!content.trim()) {
      toast.error("Please enter some content first");
      return;
    }

    setIsSuggesting(true);

    try {
      const apiKey = getApiKey();
      const response = await fetch("/api/suggest-tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content, apiKey }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get suggestions");
      }

      const data = await response.json();
      setTagSuggestions(data.suggestions || []);
      setShowTagSuggestionsDialog(true);
      
      toast.success(`Found ${data.suggestions.length} tag suggestions`);
    } catch (error: any) {
      toast.error(error.message || "Failed to get tag suggestions");
      if (error.message?.includes("API key")) {
        setShowSettingsDialog(true);
      }
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleUndo = () => {
    if (previousContent) {
      setContent(previousContent);
      setPreviousContent("");
      toast.success("Reverted to previous version");
    } else {
      toast.error("No previous version available");
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              {showSidebar ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center">
              <Logo size="sm" />
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Features */}
            <Button
              variant="default"
              size="sm"
              onClick={handleAIFormat}
              disabled={isFormatting || !content.trim()}
              className="gradient-primary hover-lift"
              title="AI Format (Cmd/Ctrl + Shift + F)"
            >
              {isFormatting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">AI Format</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSuggestTags}
              disabled={isSuggesting || !content.trim()}
            >
              {isSuggesting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Tag className="h-4 w-4 mr-2" />
              )}
              <span className="hidden sm:inline">Suggest Tags</span>
            </Button>
            
            {previousContent && (
              <Button variant="ghost" size="sm" onClick={handleUndo}>
                <Undo2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Undo</span>
              </Button>
            )}

            <div className="h-6 w-px bg-border mx-1" />

            <Button variant="ghost" size="sm" onClick={handleNewPrompt}>
              <FileText className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">New</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowTemplateDialog(true)}>
              <LayoutTemplate className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Template</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Export</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleImport}>
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Import</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowSettingsDialog(true)}>
              <Settings className="h-4 w-4" />
            </Button>
            <Button onClick={() => setShowSaveDialog(true)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Sidebar */}
          <aside
            className={`${
              showSidebar ? "w-64" : "w-0"
            } border-r transition-all duration-200 overflow-hidden bg-background`}
          >
            <div className="h-full flex flex-col">
              {/* Tag Palette */}
              <div className="flex-1 p-4 border-b overflow-y-auto">
                <TagPalette onInsertTag={handleInsertTag} />
              </div>

              {/* Prompt Library */}
              <div className="flex-1 p-4 overflow-y-auto">
                <PromptLibrary
                  onSelectPrompt={handleSelectPrompt}
                  currentPromptId={currentPrompt?.id}
                />
              </div>
            </div>
          </aside>

          {/* Editor and Preview */}
          <main className="flex-1 grid md:grid-cols-2 gap-4 p-4 overflow-hidden">
            <div className="h-full">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Editor</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyContent}
                  disabled={!content.trim()}
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="h-4 w-4 mr-2 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                </Button>
              </div>
              <PromptEditor value={content} onChange={setContent} />
            </div>

            <div className="h-full hidden md:block">
              <h2 className="text-lg font-semibold mb-3">Preview</h2>
              <PromptPreview content={content} />
            </div>
          </main>
        </div>
      </div>

      {/* Save Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent onClose={() => setShowSaveDialog(false)}>
          <DialogHeader>
            <DialogTitle>Save Prompt</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              <Input
                placeholder="My Awesome Prompt"
                value={promptName}
                onChange={(e) => setPromptName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Textarea
                placeholder="Describe what this prompt does..."
                value={promptDescription}
                onChange={(e) => setPromptDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={promptCategory}
                onChange={(e) => setPromptCategory(e.target.value)}
              >
                <option value="general">General</option>
                <option value="coding">Coding Assistant</option>
                <option value="analysis">Data Analysis</option>
                <option value="creative">Creative Writing</option>
              </select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePrompt} disabled={!promptName}>
              Save Prompt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Template Dialog */}
      <TemplateSelector
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onSelectTemplate={setContent}
      />

      {/* Settings Dialog */}
      <SettingsModal
        open={showSettingsDialog}
        onOpenChange={setShowSettingsDialog}
      />

      {/* Tag Suggestions Dialog */}
      <TagSuggestionsModal
        open={showTagSuggestionsDialog}
        onOpenChange={setShowTagSuggestionsDialog}
        suggestions={tagSuggestions}
        onInsertTag={handleInsertTag}
      />
    </div>
  );
}


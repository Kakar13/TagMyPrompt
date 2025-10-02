"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { saveApiKey, getApiKey, removeApiKey } from "@/lib/api-key-storage";
import { CheckCircle2, XCircle, ExternalLink, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    const key = getApiKey();
    if (key) {
      setApiKey(key);
      setHasKey(true);
    }
  }, [open]);

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }

    if (!apiKey.startsWith("sk-ant-")) {
      toast.error("Invalid API key format. Should start with 'sk-ant-'");
      return;
    }

    saveApiKey(apiKey);
    setHasKey(true);
    toast.success("API key saved successfully!");
    onOpenChange(false);
  };

  const handleRemove = () => {
    if (confirm("Are you sure you want to remove your API key?")) {
      removeApiKey();
      setApiKey("");
      setHasKey(false);
      toast.success("API key removed");
    }
  };

  const testConnection = async () => {
    if (!apiKey) {
      toast.error("Please enter an API key first");
      return;
    }

    toast.loading("Testing connection...");

    try {
      const response = await fetch("/api/format-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: "Test",
          apiKey: apiKey,
        }),
      });

      if (response.ok) {
        toast.success("Connection successful! API key is valid.");
      } else {
        const data = await response.json();
        toast.error(data.error || "Connection failed");
      }
    } catch (error) {
      toast.error("Network error. Please check your connection.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <DialogHeader>
          <DialogTitle>AI Settings</DialogTitle>
          <DialogDescription>
            Configure your Anthropic API key to enable AI-powered prompt formatting
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Anthropic API Key
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  type={showKey ? "text" : "password"}
                  placeholder="sk-ant-..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-accent rounded"
                >
                  {showKey ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your API key is stored locally and encrypted
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            {hasKey ? (
              <>
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium">API key configured</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">No API key set</span>
              </>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">How to get an API key:</p>
            <ol className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>1. Visit Anthropic Console</li>
              <li>2. Sign in or create an account</li>
              <li>3. Navigate to API Keys section</li>
              <li>4. Create a new API key</li>
              <li>5. Copy and paste it above</li>
            </ol>
            <a
              href="https://console.anthropic.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Open Anthropic Console
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="border-t pt-4">
            <p className="text-xs text-muted-foreground">
              <strong>Note:</strong> API calls are made from your browser directly to Anthropic.
              Your key is stored locally and never sent to our servers. Standard Anthropic
              API rates apply (~$3 per million input tokens for Claude Sonnet).
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          {hasKey && (
            <Button variant="destructive" onClick={handleRemove}>
              Remove Key
            </Button>
          )}
          <Button variant="outline" onClick={testConnection}>
            Test Connection
          </Button>
          <Button onClick={handleSave}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}


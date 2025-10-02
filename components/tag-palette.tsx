"use client";

import React, { useState, useEffect } from "react";
import { DEFAULT_XML_TAGS } from "@/lib/xml-tags";
import { getCustomTags, saveCustomTag, deleteCustomTag } from "@/lib/storage";
import { XMLTag } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, Tag } from "lucide-react";

interface TagPaletteProps {
  onInsertTag: (tag: string) => void;
}

export function TagPalette({ onInsertTag }: TagPaletteProps) {
  const [customTags, setCustomTags] = useState<XMLTag[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [newTag, setNewTag] = useState<Partial<XMLTag>>({
    name: "",
    description: "",
    example: "",
  });

  useEffect(() => {
    loadCustomTags();
  }, []);

  const loadCustomTags = async () => {
    const tags = await getCustomTags();
    setCustomTags(tags);
  };

  const handleSaveTag = async () => {
    if (!newTag.name) return;

    await saveCustomTag({
      name: newTag.name,
      description: newTag.description || "",
      example: newTag.example || "",
      isCustom: true,
    });

    await loadCustomTags();
    setShowDialog(false);
    setNewTag({ name: "", description: "", example: "" });
  };

  const handleDeleteTag = async (tagName: string) => {
    await deleteCustomTag(tagName);
    await loadCustomTags();
  };

  const allTags = [...DEFAULT_XML_TAGS, ...customTags];

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Tag className="h-4 w-4" />
          XML Tags
        </h3>
        <Button size="sm" variant="outline" onClick={() => setShowDialog(true)}>
          <Plus className="h-3 w-3 mr-1" />
          Custom
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {allTags.map((tag) => (
          <div
            key={tag.name}
            className="group relative p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
            onClick={() => onInsertTag(`<${tag.name}>\n\n</${tag.name}>`)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <code className="text-sm font-mono text-blue-600 dark:text-blue-400">
                  &lt;{tag.name}&gt;
                </code>
                <p className="text-xs text-muted-foreground mt-1">{tag.description}</p>
              </div>
              {tag.isCustom && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTag(tag.name);
                  }}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Custom Tag Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent onClose={() => setShowDialog(false)}>
          <DialogHeader>
            <DialogTitle>Create Custom XML Tag</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tag Name</label>
              <Input
                placeholder="my_custom_tag"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="What this tag is used for..."
                value={newTag.description}
                onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Example</label>
              <Textarea
                placeholder="<my_custom_tag>...</my_custom_tag>"
                value={newTag.example}
                onChange={(e) => setNewTag({ ...newTag, example: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveTag} disabled={!newTag.name}>
              Create Tag
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}


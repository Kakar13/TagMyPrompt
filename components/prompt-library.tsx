"use client";

import React, { useState, useEffect } from "react";
import { getPrompts, savePrompt, deletePrompt, getCategories } from "@/lib/storage";
import { Prompt, Category } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Search, Trash2, Edit, FolderOpen } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { cn } from "@/lib/utils";

interface PromptLibraryProps {
  onSelectPrompt: (prompt: Prompt) => void;
  currentPromptId?: string;
}

export function PromptLibrary({ onSelectPrompt, currentPromptId }: PromptLibraryProps) {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [promptsData, categoriesData] = await Promise.all([
      getPrompts(),
      getCategories(),
    ]);
    setPrompts(promptsData);
    setCategories(categoriesData);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this prompt?")) {
      await deletePrompt(id);
      await loadData();
    }
  };

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Search and Filter */}
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              size="sm"
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Prompts List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredPrompts.length === 0 ? (
          <EmptyState
            icon={FolderOpen}
            title={searchQuery ? "No prompts found" : "No prompts yet"}
            description={searchQuery ? "Try adjusting your search" : "Create your first prompt to get started!"}
          />
        ) : (
          filteredPrompts.map((prompt) => {
            const category = categories.find((c) => c.id === prompt.category);
            return (
              <Card
                key={prompt.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  currentPromptId === prompt.id && "ring-2 ring-primary"
                )}
                onClick={() => onSelectPrompt(prompt)}
              >
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base">{prompt.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {prompt.description}
                      </CardDescription>
                      {category && (
                        <div className="mt-2">
                          <span
                            className="inline-block px-2 py-1 text-xs rounded-full"
                            style={{
                              backgroundColor: `${category.color}20`,
                              color: category.color,
                            }}
                          >
                            {category.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={(e) => handleDelete(prompt.id, e)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}


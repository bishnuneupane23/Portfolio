import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { AboutContent, InsertAboutContent } from "@shared/schema";

export function AboutForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [content, setContent] = useState("");

  const { data: aboutContent, isLoading } = useQuery({
    queryKey: ["/api/admin/about"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertAboutContent) => {
      return await apiRequest("/api/admin/about", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/about"] });
      toast({
        title: "About content updated",
        description: "Your about content has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update about content",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (aboutContent) {
      setContent(aboutContent.content || "");
    }
  }, [aboutContent]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ content });
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading about content...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="aboutContent">About Content</Label>
        <Textarea
          id="aboutContent"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the about section content"
          rows={10}
          required
          data-testid="textarea-about-content"
        />
        <p className="text-sm text-muted-foreground">
          This content will be displayed in the About section of the portfolio.
        </p>
      </div>
      <Button
        type="submit"
        disabled={updateMutation.isPending}
        data-testid="button-save-about"
      >
        {updateMutation.isPending ? "Saving..." : "Save About Content"}
      </Button>
    </form>
  );
}
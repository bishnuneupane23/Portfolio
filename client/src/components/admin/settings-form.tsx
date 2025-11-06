import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SiteSettings, InsertSiteSettings } from "@shared/schema";
import { Save } from "lucide-react";

export function SettingsForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertSiteSettings>({
    heroTitle: "",
    heroSubtitle: "",
    calendlyUrl: null,
    resumeUrl: null,
    metaTitle: null,
    metaDescription: null,
  });

  const { data: settings, isLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/admin/settings"],
  });

  useEffect(() => {
    if (settings) {
      setFormData({
        heroTitle: settings.heroTitle,
        heroSubtitle: settings.heroSubtitle,
        calendlyUrl: settings.calendlyUrl,
        resumeUrl: settings.resumeUrl,
        metaTitle: settings.metaTitle,
        metaDescription: settings.metaDescription,
      });
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: InsertSiteSettings) => {
      return await apiRequest("/api/admin/settings", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/public/settings"] });
      toast({ title: "Settings saved", description: "Site settings have been updated successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Save failed",
        description: error.message || "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading settings...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Hero Section</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="heroTitle">Hero Title</Label>
            <Textarea
              id="heroTitle"
              value={formData.heroTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, heroTitle: e.target.value }))}
              placeholder="Main headline on the homepage"
              required
              rows={3}
              data-testid="textarea-hero-title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="heroSubtitle">Hero Subtitle</Label>
            <Textarea
              id="heroSubtitle"
              value={formData.heroSubtitle}
              onChange={(e) => setFormData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
              placeholder="Supporting text under the main headline"
              required
              rows={2}
              data-testid="textarea-hero-subtitle"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact & Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calendlyUrl">Calendly URL</Label>
            <Input
              id="calendlyUrl"
              type="url"
              value={formData.calendlyUrl || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, calendlyUrl: e.target.value || null }))}
              placeholder="https://calendly.com/yourname"
              data-testid="input-calendly-url"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resumeUrl">Resume URL</Label>
            <Input
              id="resumeUrl"
              type="url"
              value={formData.resumeUrl || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, resumeUrl: e.target.value || null }))}
              placeholder="https://example.com/resume.pdf"
              data-testid="input-resume-url"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO Metadata</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="metaTitle">Meta Title</Label>
            <Input
              id="metaTitle"
              value={formData.metaTitle || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value || null }))}
              placeholder="Page title for search engines"
              data-testid="input-meta-title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="metaDescription">Meta Description</Label>
            <Textarea
              id="metaDescription"
              value={formData.metaDescription || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value || null }))}
              placeholder="Brief description of your site for search engines"
              rows={3}
              data-testid="textarea-meta-description"
            />
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={saveMutation.isPending}
        className="w-full"
        data-testid="button-save-settings"
      >
        <Save className="mr-2 h-4 w-4" />
        Save Settings
      </Button>
    </form>
  );
}

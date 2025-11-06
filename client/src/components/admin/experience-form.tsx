import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Experience, InsertExperience } from "@shared/schema";
import { Pencil, Trash2, Plus, X } from "lucide-react";

export function ExperienceForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertExperience>({
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: null,
    isCurrent: false,
    description: null,
    achievements: [],
    displayOrder: 0,
    isActive: true,
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [achievementInput, setAchievementInput] = useState("");

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ["/api/admin/experience"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertExperience) => {
      return await apiRequest("/api/admin/experience", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/experience"] });
      toast({ title: "Experience created", description: "New experience has been added" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create experience",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertExperience> }) => {
      return await apiRequest(`/api/admin/experience/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/experience"] });
      toast({ title: "Experience updated", description: "Experience has been updated successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update experience",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/experience/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/experience"] });
      toast({ title: "Experience deleted", description: "Experience has been removed" });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete experience",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      jobTitle: "",
      company: "",
      startDate: "",
      endDate: null,
      isCurrent: false,
      description: null,
      achievements: [],
      displayOrder: 0,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
    setAchievementInput("");
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      jobTitle: experience.jobTitle,
      company: experience.company,
      startDate: experience.startDate,
      endDate: experience.endDate,
      isCurrent: experience.isCurrent ?? false,
      description: experience.description,
      achievements: experience.achievements || [],
      displayOrder: experience.displayOrder || 0,
      isActive: experience.isActive ?? true,
    });
    setEditingId(experience.id);
    setShowForm(true);
  };

  const addAchievement = () => {
    if (achievementInput.trim()) {
      setFormData(prev => ({
        ...prev,
        achievements: [...(prev.achievements || []), achievementInput.trim()],
      }));
      setAchievementInput("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      achievements: (prev.achievements || []).filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading experiences...</div>;
  }

  return (
    <div className="space-y-6">
      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle">Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                    placeholder="e.g., QA Lead"
                    required
                    data-testid="input-experience-job-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="e.g., ankaEK"
                    required
                    data-testid="input-experience-company"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    placeholder="e.g., 11/2024"
                    required
                    data-testid="input-experience-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value || null }))}
                    placeholder="e.g., Present"
                    disabled={formData.isCurrent}
                    data-testid="input-experience-end-date"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCurrent: checked, endDate: checked ? null : prev.endDate }))}
                  data-testid="switch-experience-is-current"
                />
                <Label htmlFor="isCurrent">Currently working here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || null }))}
                  placeholder="Describe your role and responsibilities"
                  data-testid="textarea-experience-description"
                />
              </div>

              <div className="space-y-2">
                <Label>Achievements</Label>
                <div className="flex space-x-2">
                  <Input
                    value={achievementInput}
                    onChange={(e) => setAchievementInput(e.target.value)}
                    placeholder="Add an achievement"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAchievement())}
                    data-testid="input-achievement"
                  />
                  <Button type="button" onClick={addAchievement} data-testid="button-add-achievement">
                    Add
                  </Button>
                </div>
                {formData.achievements && formData.achievements.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {formData.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                        <span className="text-sm" data-testid={`text-achievement-${index}`}>{achievement}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement(index)}
                          data-testid={`button-remove-achievement-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  data-testid="input-experience-display-order"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-experience"
                >
                  {editingId ? "Update Experience" : "Add Experience"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-experience">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} data-testid="button-show-experience-form">
          <Plus className="h-4 w-4 mr-2" />
          Add New Experience
        </Button>
      )}

      <div className="grid gap-4">
        {experiences.map((experience: Experience) => (
          <Card key={experience.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold" data-testid={`text-experience-title-${experience.id}`}>
                      {experience.jobTitle}
                    </h3>
                    {experience.isCurrent && (
                      <Badge variant="default" data-testid={`badge-experience-current-${experience.id}`}>Current</Badge>
                    )}
                  </div>
                  <p className="text-primary font-medium" data-testid={`text-experience-company-${experience.id}`}>{experience.company}</p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-experience-dates-${experience.id}`}>
                    {experience.startDate} - {experience.endDate || 'Present'}
                  </p>
                  {experience.description && (
                    <p className="text-sm mt-2" data-testid={`text-experience-description-${experience.id}`}>{experience.description}</p>
                  )}
                  {experience.achievements && experience.achievements.length > 0 && (
                    <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                      {experience.achievements.map((achievement, idx) => (
                        <li key={idx} data-testid={`text-experience-achievement-${experience.id}-${idx}`}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(experience)}
                    data-testid={`button-edit-experience-${experience.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(experience.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-experience-${experience.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

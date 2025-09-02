import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Project, InsertProject } from "@shared/schema";
import { Pencil, Trash2, Plus } from "lucide-react";

export function ProjectForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertProject>({
    name: "",
    slug: "",
    problem: "",
    organization: "",
    timeframe: "",
    platforms: [],
    status: "available",
    goals: [],
    testStrategy: [],
    performanceTargets: {},
    isPublished: true,
    displayOrder: 0,
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [platformInput, setPlatformInput] = useState("");
  const [goalInput, setGoalInput] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/admin/projects"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      return await apiRequest("/api/admin/projects", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project created", description: "New project has been added" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertProject> }) => {
      return await apiRequest(`/api/admin/projects/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project updated", description: "Project has been updated successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/projects/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project deleted", description: "Project has been removed" });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      problem: "",
      organization: "",
      timeframe: "",
      platforms: [],
      status: "available",
      goals: [],
      testStrategy: [],
      performanceTargets: {},
      isPublished: true,
      displayOrder: 0,
    });
    setEditingId(null);
    setShowForm(false);
    setPlatformInput("");
    setGoalInput("");
  };

  const handleEdit = (project: Project) => {
    setFormData({
      name: project.name,
      slug: project.slug,
      problem: project.problem,
      organization: project.organization,
      timeframe: project.timeframe,
      platforms: project.platforms || [],
      status: project.status,
      goals: project.goals || [],
      testStrategy: project.testStrategy || [],
      performanceTargets: project.performanceTargets || {},
      isPublished: project.isPublished ?? true,
      displayOrder: project.displayOrder || 0,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const addPlatform = () => {
    if (platformInput.trim() && !formData.platforms.includes(platformInput.trim())) {
      setFormData(prev => ({
        ...prev,
        platforms: [...prev.platforms, platformInput.trim()]
      }));
      setPlatformInput("");
    }
  };

  const removePlatform = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.filter(p => p !== platform)
    }));
  };

  const addGoal = () => {
    if (goalInput.trim() && !formData.goals.includes(goalInput.trim())) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, goalInput.trim()]
      }));
      setGoalInput("");
    }
  };

  const removeGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter(g => g !== goal)
    }));
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name</Label>
                  <Input
                    id="projectName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    }))}
                    placeholder="e.g., a-OK"
                    required
                    data-testid="input-project-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectSlug">Slug</Label>
                  <Input
                    id="projectSlug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="a-ok"
                    required
                    data-testid="input-project-slug"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                    placeholder="e.g., ankaEK"
                    required
                    data-testid="input-project-organization"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timeframe">Timeframe</Label>
                  <Input
                    id="timeframe"
                    value={formData.timeframe}
                    onChange={(e) => setFormData(prev => ({ ...prev, timeframe: e.target.value }))}
                    placeholder="e.g., Nov 2024 - Present"
                    required
                    data-testid="input-project-timeframe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger data-testid="select-project-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="coming-soon">Coming Soon</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="problem">Problem Description</Label>
                <Textarea
                  id="problem"
                  value={formData.problem}
                  onChange={(e) => setFormData(prev => ({ ...prev, problem: e.target.value }))}
                  placeholder="Describe the problem this project solves"
                  required
                  data-testid="textarea-project-problem"
                />
              </div>

              {/* Platforms */}
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="flex space-x-2">
                  <Input
                    value={platformInput}
                    onChange={(e) => setPlatformInput(e.target.value)}
                    placeholder="Add platform (Web, Mobile, API)"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPlatform())}
                    data-testid="input-platform"
                  />
                  <Button type="button" onClick={addPlatform} data-testid="button-add-platform">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.platforms.map((platform) => (
                    <Badge key={platform} variant="secondary" className="cursor-pointer" onClick={() => removePlatform(platform)}>
                      {platform} ×
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Goals */}
              <div className="space-y-2">
                <Label>Goals</Label>
                <div className="flex space-x-2">
                  <Input
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value)}
                    placeholder="Add goal or success metric"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
                    data-testid="input-goal"
                  />
                  <Button type="button" onClick={addGoal} data-testid="button-add-goal">
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.goals.map((goal) => (
                    <Badge key={goal} variant="outline" className="cursor-pointer" onClick={() => removeGoal(goal)}>
                      {goal} ×
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-project"
                >
                  {editingId ? "Update Project" : "Add Project"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-project">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} data-testid="button-show-project-form">
          <Plus className="h-4 w-4 mr-2" />
          Add New Project
        </Button>
      )}

      {/* Projects List */}
      <div className="grid gap-4">
        {projects.map((project: Project) => (
          <Card key={project.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold" data-testid={`text-project-name-${project.id}`}>
                      {project.name}
                    </h3>
                    <Badge variant="outline" data-testid={`badge-project-status-${project.id}`}>
                      {project.status}
                    </Badge>
                    <Badge variant="secondary" data-testid={`badge-project-org-${project.id}`}>
                      {project.organization}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2" data-testid={`text-project-problem-${project.id}`}>
                    {project.problem}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {project.platforms?.map((platform) => (
                      <Badge key={platform} className="bg-primary/10 text-primary">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground" data-testid={`text-project-timeframe-${project.id}`}>
                    {project.timeframe}
                  </p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(project)}
                    data-testid={`button-edit-project-${project.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(project.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-project-${project.id}`}
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
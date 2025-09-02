import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Skill, InsertSkill } from "@shared/schema";
import { Pencil, Trash2, Plus } from "lucide-react";

export function SkillForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertSkill>({
    name: "",
    level: "Beginner",
    percentage: 40,
    category: "",
    displayOrder: 0,
    isActive: true,
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ["/api/admin/skills"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertSkill) => {
      return await apiRequest("/api/admin/skills", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skills"] });
      toast({ title: "Skill created", description: "New skill has been added" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create skill",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertSkill> }) => {
      return await apiRequest(`/api/admin/skills/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skills"] });
      toast({ title: "Skill updated", description: "Skill has been updated successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update skill",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/skills/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/skills"] });
      toast({ title: "Skill deleted", description: "Skill has been removed" });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete skill",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      level: "Beginner",
      percentage: 40,
      category: "",
      displayOrder: 0,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      level: skill.level,
      percentage: skill.percentage,
      category: skill.category || "",
      displayOrder: skill.displayOrder || 0,
      isActive: skill.isActive ?? true,
    });
    setEditingId(skill.id);
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

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced": return "bg-primary/10 text-primary";
      case "Intermediate": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading skills...</div>;
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
                  <Label htmlFor="skillName">Skill Name</Label>
                  <Input
                    id="skillName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Taiga, Postman"
                    required
                    data-testid="input-skill-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillLevel">Level</Label>
                  <Select 
                    value={formData.level} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger data-testid="select-skill-level">
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillPercentage">Percentage</Label>
                  <Input
                    id="skillPercentage"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.percentage}
                    onChange={(e) => setFormData(prev => ({ ...prev, percentage: parseInt(e.target.value) }))}
                    required
                    data-testid="input-skill-percentage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="skillCategory">Category</Label>
                  <Input
                    id="skillCategory"
                    value={formData.category || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    placeholder="e.g., Testing Tools"
                    data-testid="input-skill-category"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-skill"
                >
                  {editingId ? "Update Skill" : "Add Skill"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-skill">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Add Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} data-testid="button-show-skill-form">
          <Plus className="h-4 w-4 mr-2" />
          Add New Skill
        </Button>
      )}

      {/* Skills List */}
      <div className="grid gap-4">
        {skills.map((skill: Skill) => (
          <Card key={skill.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold" data-testid={`text-skill-name-${skill.id}`}>
                      {skill.name}
                    </h3>
                    <Badge className={getLevelColor(skill.level)} data-testid={`badge-skill-level-${skill.id}`}>
                      {skill.level}
                    </Badge>
                    {skill.category && (
                      <Badge variant="outline" data-testid={`badge-skill-category-${skill.id}`}>
                        {skill.category}
                      </Badge>
                    )}
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.percentage}%` }}
                      data-testid={`progress-skill-${skill.id}`}
                    ></div>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1" data-testid={`text-skill-percentage-${skill.id}`}>
                    {skill.percentage}%
                  </span>
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(skill)}
                    data-testid={`button-edit-skill-${skill.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(skill.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-skill-${skill.id}`}
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
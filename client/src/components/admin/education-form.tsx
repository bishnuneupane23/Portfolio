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
import type { Education, InsertEducation } from "@shared/schema";
import { Pencil, Trash2, Plus } from "lucide-react";

export function EducationForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertEducation>({
    degree: "",
    institution: "",
    startDate: "",
    endDate: null,
    isCurrent: false,
    description: null,
    displayOrder: 0,
    isActive: true,
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: education = [], isLoading } = useQuery({
    queryKey: ["/api/admin/education"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertEducation) => {
      return await apiRequest("/api/admin/education", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/education"] });
      toast({ title: "Education created", description: "New education has been added" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create education",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertEducation> }) => {
      return await apiRequest(`/api/admin/education/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/education"] });
      toast({ title: "Education updated", description: "Education has been updated successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update education",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/education/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/education"] });
      toast({ title: "Education deleted", description: "Education has been removed" });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete education",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      degree: "",
      institution: "",
      startDate: "",
      endDate: null,
      isCurrent: false,
      description: null,
      displayOrder: 0,
      isActive: true,
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (edu: Education) => {
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      startDate: edu.startDate,
      endDate: edu.endDate,
      isCurrent: edu.isCurrent ?? false,
      description: edu.description,
      displayOrder: edu.displayOrder || 0,
      isActive: edu.isActive ?? true,
    });
    setEditingId(edu.id);
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

  if (isLoading) {
    return <div className="animate-pulse">Loading education...</div>;
  }

  return (
    <div className="space-y-6">
      {showForm && (
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree">Degree</Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="e.g., Bachelor of Science in Computer Science"
                    required
                    data-testid="input-education-degree"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  <Input
                    id="institution"
                    value={formData.institution}
                    onChange={(e) => setFormData(prev => ({ ...prev, institution: e.target.value }))}
                    placeholder="e.g., Tribhuvan University"
                    required
                    data-testid="input-education-institution"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    value={formData.startDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                    placeholder="e.g., 2018"
                    required
                    data-testid="input-education-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    value={formData.endDate || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value || null }))}
                    placeholder="e.g., 2022"
                    disabled={formData.isCurrent}
                    data-testid="input-education-end-date"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isCurrent"
                  checked={formData.isCurrent}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isCurrent: checked, endDate: checked ? null : prev.endDate }))}
                  data-testid="switch-education-is-current"
                />
                <Label htmlFor="isCurrent">Currently studying here</Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value || null }))}
                  placeholder="Additional details about your education"
                  data-testid="textarea-education-description"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayOrder: parseInt(e.target.value) || 0 }))}
                  data-testid="input-education-display-order"
                />
              </div>

              <div className="flex space-x-2">
                <Button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  data-testid="button-save-education"
                >
                  {editingId ? "Update Education" : "Add Education"}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} data-testid="button-cancel-education">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!showForm && (
        <Button onClick={() => setShowForm(true)} data-testid="button-show-education-form">
          <Plus className="h-4 w-4 mr-2" />
          Add New Education
        </Button>
      )}

      <div className="grid gap-4">
        {education.map((edu: Education) => (
          <Card key={edu.id} className="hover:border-primary/50 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-semibold" data-testid={`text-education-degree-${edu.id}`}>
                      {edu.degree}
                    </h3>
                    {edu.isCurrent && (
                      <Badge variant="default" data-testid={`badge-education-current-${edu.id}`}>Current</Badge>
                    )}
                  </div>
                  <p className="text-primary font-medium" data-testid={`text-education-institution-${edu.id}`}>{edu.institution}</p>
                  <p className="text-sm text-muted-foreground" data-testid={`text-education-dates-${edu.id}`}>
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </p>
                  {edu.description && (
                    <p className="text-sm mt-2" data-testid={`text-education-description-${edu.id}`}>{edu.description}</p>
                  )}
                </div>
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(edu)}
                    data-testid={`button-edit-education-${edu.id}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMutation.mutate(edu.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-education-${edu.id}`}
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

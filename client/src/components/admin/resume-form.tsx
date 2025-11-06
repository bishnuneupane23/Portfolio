import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ResumeAttachment, InsertResumeAttachment } from "@shared/schema";
import { FileText, Trash2, Plus, Download, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function ResumeForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertResumeAttachment>({
    fileName: "",
    fileUrl: "",
    fileSize: undefined,
    fileType: "",
    isActive: true,
    description: "",
  });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const { data: attachments = [], isLoading } = useQuery({
    queryKey: ["/api/admin/resume-attachments"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertResumeAttachment) => {
      return await apiRequest("/api/admin/resume-attachments", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resume-attachments"] });
      toast({ title: "Resume added", description: "New resume attachment has been added" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Creation failed",
        description: error.message || "Failed to create resume attachment",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertResumeAttachment> }) => {
      return await apiRequest(`/api/admin/resume-attachments/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resume-attachments"] });
      toast({ title: "Resume updated", description: "Resume attachment has been updated successfully" });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update resume attachment",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/admin/resume-attachments/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/resume-attachments"] });
      toast({ title: "Resume deleted", description: "Resume attachment has been removed" });
    },
    onError: (error: any) => {
      toast({
        title: "Deletion failed",
        description: error.message || "Failed to delete resume attachment",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      fileName: "",
      fileUrl: "",
      fileSize: undefined,
      fileType: "",
      isActive: true,
      description: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (attachment: ResumeAttachment) => {
    setFormData({
      fileName: attachment.fileName,
      fileUrl: attachment.fileUrl,
      fileSize: attachment.fileSize || undefined,
      fileType: attachment.fileType || "",
      isActive: attachment.isActive ?? true,
      description: attachment.description || "",
    });
    setEditingId(attachment.id);
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

  const formatFileSize = (bytes?: number | null) => {
    if (!bytes) return "Unknown size";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
  };

  if (isLoading) {
    return <div>Loading resume attachments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resume Attachments</h2>
        <Button onClick={() => setShowForm(!showForm)} variant={showForm ? "outline" : "default"}>
          {showForm ? "Cancel" : <><Plus className="mr-2 h-4 w-4" /> Add Resume</>}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Resume Attachment" : "Add New Resume Attachment"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="fileName">File Name *</Label>
                <Input
                  id="fileName"
                  value={formData.fileName}
                  onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                  placeholder="e.g., Bishnu_Resume_2024.pdf"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fileUrl">File URL *</Label>
                <Input
                  id="fileUrl"
                  type="url"
                  value={formData.fileUrl}
                  onChange={(e) => setFormData({ ...formData, fileUrl: e.target.value })}
                  placeholder="https://example.com/path/to/resume.pdf"
                  required
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Upload your resume to a file hosting service and paste the public URL here
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fileType">File Type</Label>
                  <Input
                    id="fileType"
                    value={formData.fileType || ""}
                    onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                    placeholder="e.g., application/pdf"
                  />
                </div>

                <div>
                  <Label htmlFor="fileSize">File Size (bytes)</Label>
                  <Input
                    id="fileSize"
                    type="number"
                    value={formData.fileSize || ""}
                    onChange={(e) => setFormData({ ...formData, fileSize: parseInt(e.target.value) || undefined })}
                    placeholder="e.g., 524288"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Optional description or notes about this resume"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="isActive" className="cursor-pointer">Active (visible to public)</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                  {editingId ? "Update" : "Create"} Resume
                </Button>
                {editingId && (
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel Edit
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {attachments.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No resume attachments yet. Click "Add Resume" to create one.
            </CardContent>
          </Card>
        ) : (
          attachments.map((attachment: ResumeAttachment) => (
            <Card key={attachment.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <FileText className="h-8 w-8 text-muted-foreground mt-1" />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{attachment.fileName}</h3>
                        {attachment.isActive ? (
                          <Badge variant="default">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Inactive</Badge>
                        )}
                      </div>
                      {attachment.description && (
                        <p className="text-sm text-muted-foreground">{attachment.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{formatFileSize(attachment.fileSize)}</span>
                        {attachment.fileType && <span>{attachment.fileType}</span>}
                        <span>Uploaded {formatDistanceToNow(new Date(attachment.uploadedAt))} ago</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(attachment.fileUrl, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = attachment.fileUrl;
                            link.download = attachment.fileName;
                            link.click();
                          }}
                        >
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(attachment)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        if (confirm(`Delete "${attachment.fileName}"?`)) {
                          deleteMutation.mutate(attachment.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

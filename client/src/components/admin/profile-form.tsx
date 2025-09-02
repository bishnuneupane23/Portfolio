import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Profile, InsertProfile } from "@shared/schema";

export function ProfileForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<InsertProfile>({
    name: "",
    title: "",
    location: "",
    email: "",
    phone: "",
    linkedin: "",
    experienceYears: 1,
    availability: "",
    responsePromise: "",
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ["/api/admin/profile"],
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertProfile) => {
      return await apiRequest("/api/admin/profile", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/profile"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        title: profile.title || "",
        location: profile.location || "",
        email: profile.email || "",
        phone: profile.phone || "",
        linkedin: profile.linkedin || "",
        experienceYears: profile.experienceYears || 1,
        availability: profile.availability || "",
        responsePromise: profile.responsePromise || "",
      });
    }
  }, [profile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleChange = (field: keyof InsertProfile, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <div className="animate-pulse">Loading profile...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="Enter full name"
            required
            data-testid="input-profile-name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="e.g., Quality Assurance Lead"
            required
            data-testid="input-profile-title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            placeholder="e.g., Kathmandu, Nepal"
            required
            data-testid="input-profile-location"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="Enter email address"
            required
            data-testid="input-profile-email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="Enter phone number"
            required
            data-testid="input-profile-phone"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <Input
            id="linkedin"
            type="url"
            value={formData.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="Enter LinkedIn profile URL"
            data-testid="input-profile-linkedin"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="experienceYears">Experience (Years)</Label>
          <Input
            id="experienceYears"
            type="number"
            min="0"
            value={formData.experienceYears}
            onChange={(e) => handleChange("experienceYears", parseInt(e.target.value))}
            required
            data-testid="input-profile-experience"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="availability">Availability</Label>
          <Input
            id="availability"
            value={formData.availability}
            onChange={(e) => handleChange("availability", e.target.value)}
            placeholder="e.g., Hybrid | Currently working"
            required
            data-testid="input-profile-availability"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="responsePromise">Response Promise</Label>
        <Input
          id="responsePromise"
          value={formData.responsePromise || ""}
          onChange={(e) => handleChange("responsePromise", e.target.value)}
          placeholder="e.g., I reply within 24 hours."
          data-testid="input-profile-response-promise"
        />
      </div>
      <Button
        type="submit"
        disabled={updateMutation.isPending}
        data-testid="button-save-profile"
      >
        {updateMutation.isPending ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
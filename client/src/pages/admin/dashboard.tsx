import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  LogOut, 
  User, 
  Code, 
  FolderOpen, 
  FileText,
  Plus,
  Pencil,
  Trash2,
  Briefcase,
  GraduationCap,
  Sliders,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Profile, Skill, Project, AboutContent } from "@shared/schema";
import { ProfileForm } from "@/components/admin/profile-form";
import { SkillForm } from "@/components/admin/skill-form";
import { ProjectForm } from "@/components/admin/project-form";
import { AboutForm } from "@/components/admin/about-form";
import { ExperienceForm } from "@/components/admin/experience-form";
import { EducationForm } from "@/components/admin/education-form";
import { SettingsForm } from "@/components/admin/settings-form";
import { ResumeForm } from "@/components/admin/resume-form";

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check admin authentication
  const { data: admin, isLoading: authLoading } = useQuery({
    queryKey: ["/api/admin/me"],
    retry: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("/api/admin/logout", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.clear();
      setLocation("/admin/login");
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin panel",
      });
    },
  });

  useEffect(() => {
    if (!authLoading && !admin) {
      setLocation("/admin/login");
    }
  }, [admin, authLoading, setLocation]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!admin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              <Settings className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold" data-testid="text-admin-title">
                Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground" data-testid="text-admin-username">
                Welcome, {admin.admin.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            <TabsTrigger value="profile" className="flex items-center space-x-2" data-testid="tab-profile">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center space-x-2" data-testid="tab-skills">
              <Code className="h-4 w-4" />
              <span>Skills</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="flex items-center space-x-2" data-testid="tab-projects">
              <FolderOpen className="h-4 w-4" />
              <span>Projects</span>
            </TabsTrigger>
            <TabsTrigger value="about" className="flex items-center space-x-2" data-testid="tab-about">
              <FileText className="h-4 w-4" />
              <span>About</span>
            </TabsTrigger>
            <TabsTrigger value="experience" className="flex items-center space-x-2" data-testid="tab-experience">
              <Briefcase className="h-4 w-4" />
              <span>Experience</span>
            </TabsTrigger>
            <TabsTrigger value="education" className="flex items-center space-x-2" data-testid="tab-education">
              <GraduationCap className="h-4 w-4" />
              <span>Education</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center space-x-2" data-testid="tab-settings">
              <Sliders className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
            <TabsTrigger value="resume" className="flex items-center space-x-2" data-testid="tab-resume">
              <Download className="h-4 w-4" />
              <span>Resume</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Management */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent>
                <ProfileForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills Management */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Skills Management</CardTitle>
                <Button size="sm" data-testid="button-add-skill">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Skill
                </Button>
              </CardHeader>
              <CardContent>
                <SkillForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Projects Management */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Projects Management</CardTitle>
                <Button size="sm" data-testid="button-add-project">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Project
                </Button>
              </CardHeader>
              <CardContent>
                <ProjectForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* About Content Management */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Content</CardTitle>
              </CardHeader>
              <CardContent>
                <AboutForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Experience Management */}
          <TabsContent value="experience" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <ExperienceForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Education Management */}
          <TabsContent value="education" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent>
                <EducationForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings Management */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <SettingsForm />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resume Attachments Management */}
          <TabsContent value="resume" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume Attachments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import bcrypt from "bcrypt";
import {
  insertAdminUserSchema,
  insertProfileSchema,
  insertSkillSchema,
  insertProjectSchema,
  insertAboutContentSchema,
  insertExperienceSchema,
  insertEducationSchema,
  insertSiteSettingsSchema,
  insertResumeAttachmentSchema,
} from "@shared/schema";

// Simple session middleware for admin auth
declare module 'express-session' {
  interface SessionData {
    adminId?: string;
  }
}

const requireAdmin = async (req: any, res: any, next: any) => {
  if (!req.session?.adminId) {
    return res.status(401).json({ message: "Admin authentication required" });
  }
  
  const admin = await storage.getAdminUser(req.session.adminId);
  if (!admin) {
    req.session.adminId = undefined;
    return res.status(401).json({ message: "Invalid admin session" });
  }
  
  req.admin = admin;
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Admin Authentication
  app.post("/api/admin/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }

      const admin = await storage.getAdminUserByUsername(username);
      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const validPassword = await bcrypt.compare(password, admin.password);
      if (!validPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      req.session.adminId = admin.id;
      res.json({ message: "Login successful", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logout successful" });
    });
  });

  app.get("/api/admin/me", requireAdmin, (req: any, res) => {
    res.json({ admin: { id: req.admin.id, username: req.admin.username } });
  });

  // Create initial admin user (for setup)
  app.post("/api/admin/setup", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Check if any admin users exist
      const existingAdmin = await storage.getAdminUserByUsername(username);
      if (existingAdmin) {
        return res.status(400).json({ message: "Admin user already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await storage.createAdminUser({
        username,
        password: hashedPassword,
      });

      res.json({ message: "Admin user created", admin: { id: admin.id, username: admin.username } });
    } catch (error) {
      console.error("Admin setup error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Profile Management
  app.get("/api/admin/profile", requireAdmin, async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/profile", requireAdmin, async (req, res) => {
    try {
      const validated = insertProfileSchema.parse(req.body);
      const profile = await storage.upsertProfile(validated);
      res.json(profile);
    } catch (error) {
      console.error("Update profile error:", error);
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Skills Management
  app.get("/api/admin/skills", requireAdmin, async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Get skills error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/skills", requireAdmin, async (req, res) => {
    try {
      const validated = insertSkillSchema.parse(req.body);
      const skill = await storage.createSkill(validated);
      res.json(skill);
    } catch (error) {
      console.error("Create skill error:", error);
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.put("/api/admin/skills/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, validated);
      res.json(skill);
    } catch (error) {
      console.error("Update skill error:", error);
      res.status(400).json({ message: "Invalid skill data" });
    }
  });

  app.delete("/api/admin/skills/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteSkill(id);
      res.json({ message: "Skill deleted" });
    } catch (error) {
      console.error("Delete skill error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Projects Management
  app.get("/api/admin/projects", requireAdmin, async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/projects", requireAdmin, async (req, res) => {
    try {
      const validated = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(validated);
      res.json(project);
    } catch (error) {
      console.error("Create project error:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.put("/api/admin/projects/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertProjectSchema.partial().parse(req.body);
      const project = await storage.updateProject(id, validated);
      res.json(project);
    } catch (error) {
      console.error("Update project error:", error);
      res.status(400).json({ message: "Invalid project data" });
    }
  });

  app.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteProject(id);
      res.json({ message: "Project deleted" });
    } catch (error) {
      console.error("Delete project error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // About Content Management
  app.get("/api/admin/about", requireAdmin, async (req, res) => {
    try {
      const about = await storage.getAboutContent();
      res.json(about);
    } catch (error) {
      console.error("Get about content error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/about", requireAdmin, async (req, res) => {
    try {
      const validated = insertAboutContentSchema.parse(req.body);
      const about = await storage.upsertAboutContent(validated);
      res.json(about);
    } catch (error) {
      console.error("Update about content error:", error);
      res.status(400).json({ message: "Invalid about content" });
    }
  });

  // Experience Management
  app.get("/api/admin/experience", requireAdmin, async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      console.error("Get experience error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/experience", requireAdmin, async (req, res) => {
    try {
      const validated = insertExperienceSchema.parse(req.body);
      const experience = await storage.createExperience(validated);
      res.json(experience);
    } catch (error) {
      console.error("Create experience error:", error);
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.put("/api/admin/experience/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertExperienceSchema.partial().parse(req.body);
      const experience = await storage.updateExperience(id, validated);
      res.json(experience);
    } catch (error) {
      console.error("Update experience error:", error);
      res.status(400).json({ message: "Invalid experience data" });
    }
  });

  app.delete("/api/admin/experience/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteExperience(id);
      res.json({ message: "Experience deleted" });
    } catch (error) {
      console.error("Delete experience error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Education Management
  app.get("/api/admin/education", requireAdmin, async (req, res) => {
    try {
      const education = await storage.getEducation();
      res.json(education);
    } catch (error) {
      console.error("Get education error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/education", requireAdmin, async (req, res) => {
    try {
      const validated = insertEducationSchema.parse(req.body);
      const education = await storage.createEducation(validated);
      res.json(education);
    } catch (error) {
      console.error("Create education error:", error);
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.put("/api/admin/education/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertEducationSchema.partial().parse(req.body);
      const education = await storage.updateEducation(id, validated);
      res.json(education);
    } catch (error) {
      console.error("Update education error:", error);
      res.status(400).json({ message: "Invalid education data" });
    }
  });

  app.delete("/api/admin/education/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteEducation(id);
      res.json({ message: "Education deleted" });
    } catch (error) {
      console.error("Delete education error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Site Settings Management
  app.get("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/settings", requireAdmin, async (req, res) => {
    try {
      const validated = insertSiteSettingsSchema.parse(req.body);
      const settings = await storage.upsertSiteSettings(validated);
      res.json(settings);
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(400).json({ message: "Invalid settings data" });
    }
  });

  // Resume Attachments Management
  app.get("/api/admin/resume-attachments", requireAdmin, async (req, res) => {
    try {
      const attachments = await storage.getResumeAttachments();
      res.json(attachments);
    } catch (error) {
      console.error("Get resume attachments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/admin/resume-attachments/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const attachment = await storage.getResumeAttachment(id);
      if (!attachment) {
        return res.status(404).json({ message: "Resume attachment not found" });
      }
      res.json(attachment);
    } catch (error) {
      console.error("Get resume attachment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/admin/resume-attachments", requireAdmin, async (req, res) => {
    try {
      const validated = insertResumeAttachmentSchema.parse(req.body);
      const attachment = await storage.createResumeAttachment(validated);
      res.json(attachment);
    } catch (error) {
      console.error("Create resume attachment error:", error);
      res.status(400).json({ message: "Invalid resume attachment data" });
    }
  });

  app.put("/api/admin/resume-attachments/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const validated = insertResumeAttachmentSchema.partial().parse(req.body);
      const attachment = await storage.updateResumeAttachment(id, validated);
      res.json(attachment);
    } catch (error) {
      console.error("Update resume attachment error:", error);
      res.status(400).json({ message: "Invalid resume attachment data" });
    }
  });

  app.delete("/api/admin/resume-attachments/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteResumeAttachment(id);
      res.json({ message: "Resume attachment deleted" });
    } catch (error) {
      console.error("Delete resume attachment error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Public API routes (no auth required)
  app.get("/api/public/profile", async (req, res) => {
    try {
      const profile = await storage.getProfile();
      res.json(profile);
    } catch (error) {
      console.error("Get profile error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/public/skills", async (req, res) => {
    try {
      const skills = await storage.getSkills();
      res.json(skills);
    } catch (error) {
      console.error("Get skills error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/public/projects", async (req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      console.error("Get projects error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/public/about", async (req, res) => {
    try {
      const about = await storage.getAboutContent();
      res.json(about);
    } catch (error) {
      console.error("Get about content error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/public/experience", async (req, res) => {
    try {
      const experiences = await storage.getExperiences();
      res.json(experiences);
    } catch (error) {
      console.error("Get experience error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/public/education", async (req, res) => {
    try {
      const education = await storage.getEducation();
      res.json(education);
    } catch (error) {
      console.error("Get education error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/public/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Get settings error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/public/resume-attachments", async (req, res) => {
    try {
      const attachments = await storage.getResumeAttachments();
      res.json(attachments);
    } catch (error) {
      console.error("Get resume attachments error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

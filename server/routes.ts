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

  const httpServer = createServer(app);
  return httpServer;
}

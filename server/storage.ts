import {
  adminUsers,
  profile,
  skills,
  projects,
  aboutContent,
  type AdminUser,
  type InsertAdminUser,
  type Profile,
  type InsertProfile,
  type Skill,
  type InsertSkill,
  type Project,
  type InsertProject,
  type AboutContent,
  type InsertAboutContent,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Admin users
  getAdminUser(id: string): Promise<AdminUser | undefined>;
  getAdminUserByUsername(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;

  // Profile
  getProfile(): Promise<Profile | undefined>;
  upsertProfile(data: InsertProfile): Promise<Profile>;

  // Skills
  getSkills(): Promise<Skill[]>;
  createSkill(skill: InsertSkill): Promise<Skill>;
  updateSkill(id: string, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: string): Promise<void>;

  // Projects
  getProjects(): Promise<Project[]>;
  getProject(slug: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  // About content
  getAboutContent(): Promise<AboutContent | undefined>;
  upsertAboutContent(content: InsertAboutContent): Promise<AboutContent>;
}

export class DatabaseStorage implements IStorage {
  // Admin users
  async getAdminUser(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user;
  }

  async getAdminUserByUsername(username: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.username, username));
    return user;
  }

  async createAdminUser(userData: InsertAdminUser): Promise<AdminUser> {
    const [user] = await db.insert(adminUsers).values(userData).returning();
    return user;
  }

  // Profile
  async getProfile(): Promise<Profile | undefined> {
    const [profileData] = await db.select().from(profile).limit(1);
    return profileData;
  }

  async upsertProfile(data: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    
    if (existing) {
      const [updated] = await db
        .update(profile)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(profile.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(profile).values(data).returning();
      return created;
    }
  }

  // Skills
  async getSkills(): Promise<Skill[]> {
    return await db.select().from(skills).where(eq(skills.isActive, true)).orderBy(skills.displayOrder);
  }

  async createSkill(skillData: InsertSkill): Promise<Skill> {
    const [skill] = await db.insert(skills).values(skillData).returning();
    return skill;
  }

  async updateSkill(id: string, skillData: Partial<InsertSkill>): Promise<Skill> {
    const [skill] = await db
      .update(skills)
      .set(skillData)
      .where(eq(skills.id, id))
      .returning();
    return skill;
  }

  async deleteSkill(id: string): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Projects
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).where(eq(projects.isPublished, true)).orderBy(projects.displayOrder);
  }

  async getProject(slug: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    return project;
  }

  async createProject(projectData: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(projectData).returning();
    return project;
  }

  async updateProject(id: string, projectData: Partial<InsertProject>): Promise<Project> {
    const updateData: any = { ...projectData, updatedAt: new Date() };
    const [project] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<void> {
    await db.delete(projects).where(eq(projects.id, id));
  }

  // About content
  async getAboutContent(): Promise<AboutContent | undefined> {
    const [content] = await db.select().from(aboutContent).orderBy(desc(aboutContent.updatedAt)).limit(1);
    return content;
  }

  async upsertAboutContent(contentData: InsertAboutContent): Promise<AboutContent> {
    const existing = await this.getAboutContent();
    
    if (existing) {
      const [updated] = await db
        .update(aboutContent)
        .set({ ...contentData, updatedAt: new Date() })
        .where(eq(aboutContent.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(aboutContent).values(contentData).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();

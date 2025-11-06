import {
  adminUsers,
  profile,
  skills,
  projects,
  aboutContent,
  experience,
  education,
  siteSettings,
  resumeAttachments,
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
  type Experience,
  type InsertExperience,
  type Education,
  type InsertEducation,
  type SiteSettings,
  type InsertSiteSettings,
  type ResumeAttachment,
  type InsertResumeAttachment,
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

  // Experience
  getExperiences(): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience>;
  deleteExperience(id: string): Promise<void>;

  // Education
  getEducation(): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: string, education: Partial<InsertEducation>): Promise<Education>;
  deleteEducation(id: string): Promise<void>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  upsertSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;

  // Resume Attachments
  getResumeAttachments(): Promise<ResumeAttachment[]>;
  getResumeAttachment(id: string): Promise<ResumeAttachment | undefined>;
  createResumeAttachment(attachment: InsertResumeAttachment): Promise<ResumeAttachment>;
  updateResumeAttachment(id: string, attachment: Partial<InsertResumeAttachment>): Promise<ResumeAttachment>;
  deleteResumeAttachment(id: string): Promise<void>;
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

  // Experience
  async getExperiences(): Promise<Experience[]> {
    return await db.select().from(experience).where(eq(experience.isActive, true)).orderBy(experience.displayOrder);
  }

  async createExperience(experienceData: InsertExperience): Promise<Experience> {
    const [exp] = await db.insert(experience).values(experienceData).returning();
    return exp;
  }

  async updateExperience(id: string, experienceData: Partial<InsertExperience>): Promise<Experience> {
    const [exp] = await db
      .update(experience)
      .set(experienceData)
      .where(eq(experience.id, id))
      .returning();
    return exp;
  }

  async deleteExperience(id: string): Promise<void> {
    await db.delete(experience).where(eq(experience.id, id));
  }

  // Education
  async getEducation(): Promise<Education[]> {
    return await db.select().from(education).where(eq(education.isActive, true)).orderBy(education.displayOrder);
  }

  async createEducation(educationData: InsertEducation): Promise<Education> {
    const [edu] = await db.insert(education).values(educationData).returning();
    return edu;
  }

  async updateEducation(id: string, educationData: Partial<InsertEducation>): Promise<Education> {
    const [edu] = await db
      .update(education)
      .set(educationData)
      .where(eq(education.id, id))
      .returning();
    return edu;
  }

  async deleteEducation(id: string): Promise<void> {
    await db.delete(education).where(eq(education.id, id));
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    const [settings] = await db.select().from(siteSettings).orderBy(desc(siteSettings.updatedAt)).limit(1);
    return settings;
  }

  async upsertSiteSettings(settingsData: InsertSiteSettings): Promise<SiteSettings> {
    const existing = await this.getSiteSettings();
    
    if (existing) {
      const [updated] = await db
        .update(siteSettings)
        .set({ ...settingsData, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siteSettings).values(settingsData).returning();
      return created;
    }
  }

  // Resume Attachments
  async getResumeAttachments(): Promise<ResumeAttachment[]> {
    return await db.select().from(resumeAttachments).where(eq(resumeAttachments.isActive, true)).orderBy(desc(resumeAttachments.uploadedAt));
  }

  async getResumeAttachment(id: string): Promise<ResumeAttachment | undefined> {
    const [attachment] = await db.select().from(resumeAttachments).where(eq(resumeAttachments.id, id));
    return attachment;
  }

  async createResumeAttachment(attachmentData: InsertResumeAttachment): Promise<ResumeAttachment> {
    const [attachment] = await db.insert(resumeAttachments).values(attachmentData as any).returning();
    return attachment;
  }

  async updateResumeAttachment(id: string, attachmentData: Partial<InsertResumeAttachment>): Promise<ResumeAttachment> {
    const [attachment] = await db
      .update(resumeAttachments)
      .set(attachmentData as any)
      .where(eq(resumeAttachments.id, id))
      .returning();
    return attachment;
  }

  async deleteResumeAttachment(id: string): Promise<void> {
    await db.delete(resumeAttachments).where(eq(resumeAttachments.id, id));
  }
}

export const storage = new DatabaseStorage();

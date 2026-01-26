import { 
  userProfiles, 
  hobbyPlans, 
  userProgress,
  type UserProfile, 
  type InsertUserProfile,
  type HobbyPlan,
  type InsertHobbyPlan,
  type UserProgress,
  type InsertUserProgress
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUserProfile(id: string): Promise<UserProfile | undefined>;
  getUserProfileByEmail(email: string): Promise<UserProfile | undefined>;
  createUserProfile(user: InsertUserProfile): Promise<UserProfile>;
  getHobbyPlans(userId: string): Promise<HobbyPlan[]>;
  createHobbyPlan(plan: InsertHobbyPlan): Promise<HobbyPlan>;
  getUserProgress(userId: string): Promise<UserProgress[]>;
  createOrUpdateUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
}

export class DatabaseStorage implements IStorage {
  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.id, id));
    return result[0];
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    const result = await db.select().from(userProfiles).where(eq(userProfiles.email, email));
    return result[0];
  }

  async createUserProfile(insertUser: InsertUserProfile): Promise<UserProfile> {
    const result = await db.insert(userProfiles).values(insertUser).returning();
    return result[0];
  }

  async getHobbyPlans(userId: string): Promise<HobbyPlan[]> {
    return await db.select().from(hobbyPlans).where(eq(hobbyPlans.userId, userId));
  }

  async createHobbyPlan(insertPlan: InsertHobbyPlan): Promise<HobbyPlan> {
    const result = await db.insert(hobbyPlans).values(insertPlan).returning();
    return result[0];
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return await db.select().from(userProgress).where(eq(userProgress.userId, userId));
  }

  async createOrUpdateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Try to find existing progress
    const existing = await db.select().from(userProgress)
      .where(and(
        eq(userProgress.userId, insertProgress.userId!),
        eq(userProgress.planId, insertProgress.planId!)
      ));

    if (existing.length > 0) {
      // Update existing progress
      const result = await db.update(userProgress)
        .set({
          ...insertProgress,
          lastAccessedAt: new Date()
        })
        .where(and(
          eq(userProgress.userId, insertProgress.userId!),
          eq(userProgress.planId, insertProgress.planId!)
        ))
        .returning();
      return result[0];
    } else {
      // Create new progress
      const result = await db.insert(userProgress).values(insertProgress).returning();
      return result[0];
    }
  }
}

// Legacy memory storage for compatibility (if needed for local development)
export class MemStorage implements IStorage {
  private users: Map<string, UserProfile>;
  private hobbyPlans: Map<string, HobbyPlan>;
  private userProgress: Map<string, UserProgress>;

  constructor() {
    this.users = new Map();
    this.hobbyPlans = new Map();
    this.userProgress = new Map();
  }

  async getUserProfile(id: string): Promise<UserProfile | undefined> {
    return this.users.get(id);
  }

  async getUserProfileByEmail(email: string): Promise<UserProfile | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUserProfile(insertUser: InsertUserProfile): Promise<UserProfile> {
    const id = insertUser.id || crypto.randomUUID();
    const user: UserProfile = { 
      id,
      email: insertUser.email,
      username: insertUser.username || null,
      firstName: insertUser.firstName || null,
      lastName: insertUser.lastName || null,
      avatarUrl: insertUser.avatarUrl || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async getHobbyPlans(userId: string): Promise<HobbyPlan[]> {
    return Array.from(this.hobbyPlans.values()).filter(
      (plan) => plan.userId === userId
    );
  }

  async createHobbyPlan(insertPlan: InsertHobbyPlan): Promise<HobbyPlan> {
    const id = crypto.randomUUID();
    const plan: HobbyPlan = {
      id,
      userId: insertPlan.userId || null,
      hobby: insertPlan.hobby,
      title: insertPlan.title,
      overview: insertPlan.overview,
      planData: insertPlan.planData,
      createdAt: new Date()
    };
    this.hobbyPlans.set(id, plan);
    return plan;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(
      (progress) => progress.userId === userId
    );
  }

  async createOrUpdateUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    // Find existing progress for this user and plan
    const existing = Array.from(this.userProgress.values()).find(
      (progress) => progress.userId === insertProgress.userId && progress.planId === insertProgress.planId
    );

    if (existing) {
      // Update existing progress
      const updated: UserProgress = {
        ...existing,
        ...insertProgress,
        lastAccessedAt: new Date()
      };
      this.userProgress.set(existing.id, updated);
      return updated;
    } else {
      // Create new progress
      const id = crypto.randomUUID();
      const progress: UserProgress = {
        id,
        userId: insertProgress.userId || null,
        planId: insertProgress.planId || null,
        completedDays: insertProgress.completedDays || [],
        currentDay: insertProgress.currentDay || 1,
        unlockedDays: insertProgress.unlockedDays || [1],
        lastAccessedAt: new Date()
      };
      this.userProgress.set(id, progress);
      return progress;
    }
  }
}

export const storage = new DatabaseStorage();

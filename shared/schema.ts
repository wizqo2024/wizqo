import { pgTable, text, serial, integer, boolean, jsonb, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User profiles table (matches Supabase structure)
export const userProfiles = pgTable("user_profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  username: text("username"),
  firstName: text("first_name"),
  lastName: text("last_name"),
  avatarUrl: text("avatar_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const hobbyPlans = pgTable("hobby_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  hobby: text("hobby").notNull(),
  title: text("title").notNull(),
  overview: text("overview").notNull(),
  planData: jsonb("plan_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => userProfiles.id, { onDelete: "cascade" }),
  planId: uuid("plan_id").references(() => hobbyPlans.id, { onDelete: "cascade" }),
  completedDays: integer("completed_days").array().notNull().default([]),
  currentDay: integer("current_day").notNull().default(1),
  unlockedDays: integer("unlocked_days").array().notNull().default([1]),
  lastAccessedAt: timestamp("last_accessed_at").defaultNow().notNull(),
});

export const insertUserProfileSchema = createInsertSchema(userProfiles).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertHobbyPlanSchema = createInsertSchema(hobbyPlans).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  lastAccessedAt: true,
});

export const updateUserProgressSchema = createInsertSchema(userProgress).pick({
  completedDays: true,
  currentDay: true,
  unlockedDays: true,
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = z.infer<typeof insertUserProfileSchema>;
export type HobbyPlan = typeof hobbyPlans.$inferSelect;
export type InsertHobbyPlan = z.infer<typeof insertHobbyPlanSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type UpdateUserProgress = z.infer<typeof updateUserProgressSchema>;
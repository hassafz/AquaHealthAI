import { pgTable, text, serial, integer, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const algaeAnalyses = pgTable("algae_analyses", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  result: jsonb("result"),
  createdAt: text("created_at").notNull(),
});

export const fishHealthAnalyses = pgTable("fish_health_analyses", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  result: jsonb("result"),
  createdAt: text("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAlgaeAnalysisSchema = createInsertSchema(algaeAnalyses).pick({
  imageUrl: true,
  result: true,
  createdAt: true,
});

export const insertFishHealthAnalysisSchema = createInsertSchema(fishHealthAnalyses).pick({
  imageUrl: true,
  result: true,
  createdAt: true,
});

// AlgaeAnalysis expected response type
export const algaeAnalysisResponseSchema = z.object({
  algae_type: z.object({
    common_name: z.string(),
    scientific_name: z.string(),
  }),
  confidence: z.number().min(0).max(100),
  description: z.string(),
  causes: z.string(),
  identification_details: z.string(),
  treatment_plan: z.array(z.string()),
});

// FishHealth expected response type
export const fishHealthResponseSchema = z.object({
  disease: z.object({
    common_name: z.string(),
    scientific_name: z.string(),
  }),
  confidence: z.number().min(0).max(100),
  symptoms: z.string(),
  causes: z.string(),
  diagnosis_details: z.string(),
  treatment_plan: z.array(z.string()),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type AlgaeAnalysisResponse = z.infer<typeof algaeAnalysisResponseSchema>;
export type InsertAlgaeAnalysis = z.infer<typeof insertAlgaeAnalysisSchema>;
export type AlgaeAnalysis = typeof algaeAnalyses.$inferSelect;

export type FishHealthResponse = z.infer<typeof fishHealthResponseSchema>;
export type InsertFishHealthAnalysis = z.infer<typeof insertFishHealthAnalysisSchema>;
export type FishHealthAnalysis = typeof fishHealthAnalyses.$inferSelect;

import { 
  users, type User, type InsertUser, 
  algaeAnalyses, type AlgaeAnalysis, type InsertAlgaeAnalysis,
  fishHealthAnalyses, type FishHealthAnalysis, type InsertFishHealthAnalysis
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Algae Analysis
  createAlgaeAnalysis(analysis: InsertAlgaeAnalysis): Promise<AlgaeAnalysis>;
  getAlgaeAnalysis(id: number): Promise<AlgaeAnalysis | undefined>;
  
  // Fish Health Analysis
  createFishHealthAnalysis(analysis: InsertFishHealthAnalysis): Promise<FishHealthAnalysis>;
  getFishHealthAnalysis(id: number): Promise<FishHealthAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private algaeAnalyses: Map<number, AlgaeAnalysis>;
  private fishHealthAnalyses: Map<number, FishHealthAnalysis>;
  currentUserId: number;
  currentAlgaeAnalysisId: number;
  currentFishHealthAnalysisId: number;

  constructor() {
    this.users = new Map();
    this.algaeAnalyses = new Map();
    this.fishHealthAnalyses = new Map();
    this.currentUserId = 1;
    this.currentAlgaeAnalysisId = 1;
    this.currentFishHealthAnalysisId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Algae Analysis methods
  async createAlgaeAnalysis(insertAnalysis: InsertAlgaeAnalysis): Promise<AlgaeAnalysis> {
    const id = this.currentAlgaeAnalysisId++;
    const analysis: AlgaeAnalysis = { ...insertAnalysis, id };
    this.algaeAnalyses.set(id, analysis);
    return analysis;
  }

  async getAlgaeAnalysis(id: number): Promise<AlgaeAnalysis | undefined> {
    return this.algaeAnalyses.get(id);
  }

  // Fish Health Analysis methods
  async createFishHealthAnalysis(insertAnalysis: InsertFishHealthAnalysis): Promise<FishHealthAnalysis> {
    const id = this.currentFishHealthAnalysisId++;
    const analysis: FishHealthAnalysis = { ...insertAnalysis, id };
    this.fishHealthAnalyses.set(id, analysis);
    return analysis;
  }

  async getFishHealthAnalysis(id: number): Promise<FishHealthAnalysis | undefined> {
    return this.fishHealthAnalyses.get(id);
  }
}

export const storage = new MemStorage();

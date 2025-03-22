import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeAlgaeImage, analyzeFishHealthImage } from "./openai";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { 
  algaeAnalysisResponseSchema, 
  fishHealthResponseSchema, 
  InsertAlgaeAnalysis,
  InsertFishHealthAnalysis
} from "@shared/schema";
import { ZodError } from "zod";

// Set up file uploading with multer
const storage_engine = multer.memoryStorage();
const upload = multer({ 
  storage: storage_engine,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG and PNG images are allowed"));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Add API routes
  const router = express.Router();

  // Analyze algae image
  router.post('/analyze-algae', upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Convert the buffer to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Get analysis from OpenAI
      const result = await analyzeAlgaeImage(base64Image);
      
      // Validate the response with Zod
      const validatedResult = algaeAnalysisResponseSchema.parse(result);
      
      // Save analysis to storage
      const analysis: InsertAlgaeAnalysis = {
        imageUrl: "data:image/jpeg;base64," + base64Image.substring(0, 100), // Store just a bit for referencing
        result: validatedResult,
        createdAt: new Date().toISOString(),
      };
      
      const savedAnalysis = await storage.createAlgaeAnalysis(analysis);
      
      res.status(200).json({
        id: savedAnalysis.id,
        result: validatedResult
      });
    } catch (error) {
      console.error('Error analyzing algae image:', error);
      
      if (error instanceof ZodError) {
        return res.status(422).json({ 
          message: 'Invalid analysis result format', 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: 'Error analyzing image',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Analyze fish health image
  router.post('/analyze-fish', upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Convert the buffer to base64
      const base64Image = req.file.buffer.toString('base64');
      
      // Get analysis from OpenAI
      const result = await analyzeFishHealthImage(base64Image);
      
      // Validate the response with Zod
      const validatedResult = fishHealthResponseSchema.parse(result);
      
      // Save analysis to storage
      const analysis: InsertFishHealthAnalysis = {
        imageUrl: "data:image/jpeg;base64," + base64Image.substring(0, 100), // Store just a bit for referencing
        result: validatedResult,
        createdAt: new Date().toISOString(),
      };
      
      const savedAnalysis = await storage.createFishHealthAnalysis(analysis);
      
      res.status(200).json({
        id: savedAnalysis.id,
        result: validatedResult
      });
    } catch (error) {
      console.error('Error analyzing fish health image:', error);
      
      if (error instanceof ZodError) {
        return res.status(422).json({ 
          message: 'Invalid analysis result format', 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: 'Error analyzing image',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Register the router
  app.use('/api', router);

  const httpServer = createServer(app);
  return httpServer;
}

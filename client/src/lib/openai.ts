import { algaeAnalysisResponseSchema, fishHealthResponseSchema } from "@shared/schema";

// Function to analyze algae image
export async function analyzeAlgaeImage(file: File) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/analyze-algae", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to analyze algae image");
    }

    const data = await response.json();
    
    // Validate response with Zod schema
    const validatedResult = algaeAnalysisResponseSchema.parse(data.result);
    
    return {
      id: data.id,
      result: validatedResult
    };
  } catch (error) {
    console.error("Error analyzing algae image:", error);
    throw error;
  }
}

// Function to analyze fish health image
export async function analyzeFishHealthImage(file: File) {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch("/api/analyze-fish", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to analyze fish health image");
    }

    const data = await response.json();
    
    // Validate response with Zod schema
    const validatedResult = fishHealthResponseSchema.parse(data.result);
    
    return {
      id: data.id,
      result: validatedResult
    };
  } catch (error) {
    console.error("Error analyzing fish health image:", error);
    throw error;
  }
}

import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error("ERROR: OPENAI_API_KEY environment variable is required");
}

// Initialize OpenAI client
// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey });

// System prompts
const ALGAE_SYSTEM_PROMPT = `You are a planted tank expert with a PhD in aquatic plants. Carefully analyze the aquarium image, identify the algae species, and provide a precise 2-week action plan. Be extremely specific. Describe physical traits, causes, and unique identifiers. Maintain high confidence before concluding. Return a structured JSON response.`;

const FISH_SYSTEM_PROMPT = `You are a fish pathology expert with a PhD in aquatic veterinary medicine. Carefully analyze the image of the fish, identify any visible diseases or health issues, and provide a precise treatment plan. Be extremely specific. Describe visible symptoms, likely causes, and diagnostic details. Maintain high confidence before concluding. Return a structured JSON response.`;

const CONTENT_REWRITE_PROMPT = `You are an SEO expert specializing in aquarium-related content. Your task is to rewrite the provided content to make it unique, engaging, and optimized for search engines while retaining all the factual information and educational value. 

Follow these guidelines:
1. Make the content substantially different from the original to avoid duplicate content issues
2. Use a friendly, authoritative tone while maintaining scientific accuracy
3. Incorporate relevant SEO keywords naturally throughout the text
4. Maintain the same organizational structure with headings and subheadings
5. Keep all factual information intact, including species names and technical instructions
6. Ensure the rewritten content provides the same educational value
7. Preserve any HTML formatting tags like <h2>, <p>, <ul>, <li>, etc.

The content is about aquarium maintenance and dealing with specific algae types or fish health issues.`;

// Function to analyze algae image
export async function analyzeAlgaeImage(base64Image: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: ALGAE_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this aquarium image and identify the algae type. Return the information in this JSON format: { \"algae_type\": { \"common_name\": \"string\", \"scientific_name\": \"string\" }, \"confidence\": number (0-100), \"description\": \"detailed physical traits (color, texture, growth)\", \"causes\": \"tank conditions like light, nutrients, CO2\", \"identification_details\": \"how the algae was visually identified\", \"treatment_plan\": [\"step1\", \"step2\", ...] }"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing algae image:", error);
    throw error;
  }
}

// Function to analyze fish health image
export async function analyzeFishHealthImage(base64Image: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: FISH_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please analyze this fish image and identify any visible health issues or diseases. Return the information in this JSON format: { \"disease\": { \"common_name\": \"string\", \"scientific_name\": \"string\" }, \"confidence\": number (0-100), \"symptoms\": \"visible symptoms in the image\", \"causes\": \"likely causes of the condition\", \"diagnosis_details\": \"how the condition was visually identified\", \"treatment_plan\": [\"step1\", \"step2\", ...] }"
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const content = response.choices[0].message.content || '{}';
    return JSON.parse(content);
  } catch (error) {
    console.error("Error analyzing fish health image:", error);
    throw error;
  }
}

/**
 * Rewrites content to make it unique and SEO-optimized
 * @param htmlContent Original HTML content to rewrite
 * @returns Rewritten HTML content
 */
export async function rewriteContentForSEO(htmlContent: string) {
  try {
    console.log("[OpenAI] Rewriting content for SEO...");
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: CONTENT_REWRITE_PROMPT
        },
        {
          role: "user",
          content: `Please rewrite the following HTML content to make it unique and SEO-optimized while preserving all HTML tags and structure:\n\n${htmlContent}`
        }
      ],
      max_tokens: 3000
    });

    return response.choices[0].message.content || htmlContent;
  } catch (error) {
    console.error("Error rewriting content for SEO:", error);
    // Return original content if rewriting fails
    return htmlContent;
  }
}

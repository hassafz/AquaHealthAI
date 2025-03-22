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

    return JSON.parse(response.choices[0].message.content);
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

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("Error analyzing fish health image:", error);
    throw error;
  }
}

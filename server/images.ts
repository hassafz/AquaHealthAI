import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { log } from './vite';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function generateAquascapeImage() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A beautiful freshwater aquascape with lush green plants, driftwood, and colorful stones. Clear water with perfect lighting. Professional aquarium photography style.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    // Download and save the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const imagePath = path.join(imagesDir, 'aquascape.jpg');
    fs.writeFileSync(imagePath, buffer);

    log(`Image generated and saved to ${imagePath}`, 'OpenAI');
    return '/images/aquascape.jpg';
  } catch (error) {
    console.error('Error generating aquascape image:', error);
    throw error;
  }
}

export async function generateFishImage() {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A stunning freshwater tropical fish with vibrant colors. Betta or discus fish with flowing fins. Professional aquarium photography with black background. Extreme detail, beautiful lighting.",
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL returned from OpenAI");
    }

    // Download and save the image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    const imagesDir = path.join(publicDir, 'images');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }
    
    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir);
    }

    const imagePath = path.join(imagesDir, 'fish.jpg');
    fs.writeFileSync(imagePath, buffer);

    log(`Image generated and saved to ${imagePath}`, 'OpenAI');
    return '/images/fish.jpg';
  } catch (error) {
    console.error('Error generating fish image:', error);
    throw error;
  }
}
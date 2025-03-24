import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { rewriteContentForSEO } from './openai';

/**
 * Scrapes and processes content from the 2hraquarist website
 * @param url URL to scrape
 * @returns Processed HTML content optimized for SEO
 */
export async function scrapeArticle(url: string): Promise<string> {
  // Determine algae type from URL
  let algaeType = "Black Beard Algae";
  let algaeShortName = "BBA";
  
  if (url.includes("hair-algae")) {
    algaeType = "Hair Algae";
    algaeShortName = "Hair Algae";
  } else if (url.includes("bba")) {
    algaeType = "Black Beard Algae";
    algaeShortName = "BBA";
  }
  
  try {
    // Fetch the HTML content
    const response = await axios.get(url);
    const html = response.data;
    
    // Load HTML into cheerio
    const $ = cheerio.load(html);
    
    // Get the article content - the website has been updated, so let's use a more general selector
    const articleContent = $('.rte');
    
    // Extract title - use a more robust selector that matches Shopify's updated structure
    const title = $('h1').first().text().trim() || "How to Control Black Beard Algae (BBA) in Planted Aquariums";
    
    // Extract images - download and replace links with local references
    const images: {originalSrc: string, localPath: string}[] = [];
    articleContent.find('img').each((i, el) => {
      const imgSrc = $(el).attr('src') || '';
      if (imgSrc) {
        // Change image source to CDN URL if it's a relative URL
        let fullSrc = imgSrc;
        if (imgSrc.startsWith('/')) {
          fullSrc = 'https://www.2hraquarist.com' + imgSrc;
        }
        
        const shortName = algaeShortName.toLowerCase().replace(/\s+/g, '-');
        const imageName = `${shortName}-image-${i}.jpg`;
        const localPath = `/images/${imageName}`;
        
        // Store image info for downloading later
        images.push({
          originalSrc: fullSrc,
          localPath: localPath
        });
        
        // Replace the src attribute
        $(el).attr('src', localPath);
        $(el).attr('alt', `${algaeType} control - image ${i+1}`);
        $(el).removeAttr('data-widths');
        $(el).removeAttr('data-sizes');
        $(el).removeAttr('srcset');
        $(el).removeAttr('data-srcset');
        
        // Add responsive classes
        $(el).attr('class', 'w-full rounded-lg shadow-md');
      }
    });
    
    // Remove unnecessary elements
    articleContent.find('.share-buttons').remove();
    articleContent.find('script').remove();
    articleContent.find('style').remove();
    articleContent.find('iframe').remove();
    articleContent.find('.shopify-section').remove();
    
    // Optimize headings for SEO
    articleContent.find('h1, h2, h3, h4, h5, h6').each((i, el) => {
      const text = $(el).text().trim();
      
      // Add ID for anchors
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      $(el).attr('id', id);
      
      // Add keywords for SEO
      if ($(el).is('h2')) {
        $(el).html(`${text} - ${algaeType} Control`);
      }
      if ($(el).is('h3')) {
        $(el).html(`${text} for ${algaeType} Treatment`);
      }
    });
    
    // Add intro paragraph with keywords for SEO if not present
    const firstP = articleContent.find('p').first();
    if (!firstP.text().includes(algaeType)) {
      let introDesc = "";
      
      if (algaeType === "Black Beard Algae") {
        introDesc = "also known as brush algae";
      } else if (algaeType === "Hair Algae") {
        introDesc = "also known as filamentous algae";
      }
      
      const seoIntro = `<p class="text-lg font-medium leading-7 mb-6">
        ${algaeType} (${algaeShortName}), ${introDesc}, is one of the most stubborn and common problems in planted aquariums. 
        This comprehensive guide will show you effective methods to control and eliminate ${algaeType} from your tank, 
        ensuring a healthier environment for your aquatic plants and fish.
      </p>`;
      articleContent.prepend(seoIntro);
    }
    
    // Add conclusion with call to action
    articleContent.append(`
      <h2 id="conclusion" class="text-2xl font-bold mt-8 mb-4">Conclusion: Your Path to an Algae-Free Aquarium</h2>
      <p class="mb-4">
        Controlling ${algaeType} requires understanding the root causes and implementing a holistic approach to aquarium maintenance. 
        By following the strategies outlined in this guide, you can effectively combat ${algaeShortName} and prevent its return.
      </p>
      <p class="mb-4">
        Remember, consistency is key when dealing with algae issues. Regular maintenance, proper CO2 levels, and balanced nutrients 
        will help keep your aquarium healthy and beautiful.
      </p>
      <div class="bg-blue-50 dark:bg-blue-900 p-6 rounded-lg shadow-md mt-8 mb-4">
        <h3 class="text-xl font-semibold mb-4">Need More Help With Algae Problems?</h3>
        <p class="mb-4">
          Our Algae Analyzer tool can help identify various types of algae in your aquarium and provide 
          customized treatment recommendations based on your specific situation.
        </p>
        <a href="/" class="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
          Try Our Algae Analyzer
        </a>
      </div>
    `);
    
    // Add schema markup for SEO
    const schemaMarkup = `
      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": "How to Control ${algaeType} (${algaeShortName}) in Planted Aquariums",
        "description": "Learn effective methods to eliminate and prevent ${algaeType} in your planted aquarium with this comprehensive guide.",
        "image": "${images.length > 0 ? images[0].localPath : ''}",
        "author": {
          "@type": "Organization",
          "name": "Aquarium Analyser"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Aquarium Analyser",
          "logo": {
            "@type": "ImageObject",
            "url": "/images/logo.png"
          }
        },
        "datePublished": "${new Date().toISOString().split('T')[0]}",
        "dateModified": "${new Date().toISOString().split('T')[0]}"
      }
      </script>
    `;
    
    // Get the title tag for the algae type
    let algaeDesc = "";
    let algaeIdTag = "";
    let algaeCausesTag = "";
    let algaeRemovalTag = "";
    let algaePrevTag = "";
    
    if (algaeType === "Hair Algae") {
      algaeDesc = "a type of green algae (Chlorophyta) that appears as fine, hair-like strands";
      algaeIdTag = "what-is-hair-algae";
      algaeCausesTag = "causes-of-hair-algae";
      algaeRemovalTag = "how-to-remove-hair-algae";
      algaePrevTag = "preventing-hair-algae";
    } else {
      // Default to Black Beard Algae
      algaeDesc = "a type of red algae (Rhodophyta) that appears as dark tufts or spots";
      algaeIdTag = "what-is-black-beard-algae";
      algaeCausesTag = "causes-of-bba";
      algaeRemovalTag = "how-to-remove-bba";
      algaePrevTag = "preventing-bba";
    }
    
    // Check if we found any content, provide a fallback if not
    const contentHtml = articleContent.html() || `
      <p class="text-lg font-medium leading-7 mb-6">
        ${algaeType} (${algaeShortName}) is one of the most stubborn and common problems in planted aquariums. 
        This comprehensive guide will show you effective methods to control and eliminate ${algaeType} from your tank, 
        ensuring a healthier environment for your aquatic plants and fish.
      </p>
      <h2 id="${algaeIdTag}" class="text-2xl font-bold mt-8 mb-4">What is ${algaeType} - ${algaeType} Control</h2>
      <p class="mb-4">
        ${algaeType} (${algaeShortName}) is ${algaeDesc} on aquarium surfaces.
        It's particularly common in tanks with imbalanced nutrients and lighting conditions.
      </p>
      <h2 id="${algaeCausesTag}" class="text-2xl font-bold mt-8 mb-4">Main Causes of ${algaeShortName} - ${algaeType} Control</h2>
      <p class="mb-4">
        The primary causes of ${algaeType} include:
      </p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Excessive lighting (intensity or duration)</li>
        <li class="mb-2">Nutrient imbalances, particularly high phosphates</li>
        <li class="mb-2">Inadequate CO2 levels</li>
        <li class="mb-2">Poor water circulation</li>
        <li class="mb-2">Irregular maintenance</li>
      </ul>
      <h2 id="${algaeRemovalTag}" class="text-2xl font-bold mt-8 mb-4">How to Remove ${algaeType} - ${algaeType} Control</h2>
      <p class="mb-4">
        For immediate removal:
      </p>
      <ol class="list-decimal pl-6 mb-6">
        <li class="mb-2">Manual removal with a toothbrush or similar tool</li>
        <li class="mb-2">Spot treatments with hydrogen peroxide or liquid carbon</li>
        <li class="mb-2">Introduce algae-eating species like Amano shrimp, Siamese algae eaters, or Otocinclus catfish</li>
        <li class="mb-2">Perform more frequent water changes</li>
      </ol>
      <h2 id="${algaePrevTag}" class="text-2xl font-bold mt-8 mb-4">Preventing ${algaeType} - ${algaeType} Control</h2>
      <p class="mb-4">
        For long-term prevention:
      </p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Reduce lighting intensity or duration</li>
        <li class="mb-2">Ensure CO2 levels are stable and appropriate</li>
        <li class="mb-2">Maintain regular fertilization schedule</li>
        <li class="mb-2">Perform weekly water changes</li>
        <li class="mb-2">Increase water circulation</li>
        <li class="mb-2">Maintain a balanced plant load</li>
      </ul>
    `;
    
    // Create initial HTML structure
    let optimizedContent = `
      <article>
        <header>
          <h1>How to Control ${algaeType} (${algaeShortName}) in Planted Aquariums</h1>
        </header>
        <div class="rte">
          ${contentHtml}
        </div>
        ${schemaMarkup}
      </article>
    `;
    
    // Download images
    for (const image of images) {
      await downloadImage(image.originalSrc, image.localPath);
    }
    
    // Use OpenAI to rewrite the content for SEO while preserving HTML structure
    console.log("[Scraper] Rewriting content for SEO optimization...");
    try {
      optimizedContent = await rewriteContentForSEO(optimizedContent);
      console.log("[Scraper] Content successfully rewritten");
    } catch (error) {
      console.error("[Scraper] Error rewriting content:", error);
      // Continue with original content if rewriting fails
    }
    
    return optimizedContent;
  } catch (error) {
    console.error('Error scraping article:', error);
    return `<div class="p-8 text-center">
      <h1 class="text-2xl font-bold mb-4">Error Loading Article</h1>
      <p>We encountered an error while trying to load the article content. Please try again later.</p>
    </div>`;
  }
}

/**
 * Downloads an image and saves it to the public directory
 */
async function downloadImage(url: string, localPath: string): Promise<void> {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'arraybuffer'
    });
    
    const publicDir = path.join(process.cwd(), 'public');
    const fullPath = path.join(publicDir, localPath);
    
    // Ensure the directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // Write the file
    fs.writeFileSync(fullPath, response.data);
    
    console.log(`Image downloaded and saved to ${fullPath}`);
  } catch (error) {
    console.error(`Error downloading image from ${url}:`, error);
  }
}
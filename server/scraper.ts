import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

/**
 * Scrapes and processes content from the 2hraquarist website
 * @param url URL to scrape
 * @returns Processed HTML content optimized for SEO
 */
export async function scrapeArticle(url: string): Promise<string> {
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
        
        const imageName = `bba-image-${i}.jpg`;
        const localPath = `/images/${imageName}`;
        
        // Store image info for downloading later
        images.push({
          originalSrc: fullSrc,
          localPath: localPath
        });
        
        // Replace the src attribute
        $(el).attr('src', localPath);
        $(el).attr('alt', `Black Beard Algae control - image ${i+1}`);
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
        $(el).html(`${text} - Black Beard Algae Control`);
      }
      if ($(el).is('h3')) {
        $(el).html(`${text} for Black Beard Algae Treatment`);
      }
    });
    
    // Add intro paragraph with keywords for SEO if not present
    const firstP = articleContent.find('p').first();
    if (!firstP.text().includes('Black Beard Algae')) {
      const seoIntro = `<p class="text-lg font-medium leading-7 mb-6">
        Black Beard Algae (BBA), also known as brush algae, is one of the most stubborn and common problems in planted aquariums. 
        This comprehensive guide will show you effective methods to control and eliminate Black Beard Algae from your tank, 
        ensuring a healthier environment for your aquatic plants and fish.
      </p>`;
      articleContent.prepend(seoIntro);
    }
    
    // Add conclusion with call to action
    articleContent.append(`
      <h2 id="conclusion" class="text-2xl font-bold mt-8 mb-4">Conclusion: Your Path to an Algae-Free Aquarium</h2>
      <p class="mb-4">
        Controlling Black Beard Algae requires understanding the root causes and implementing a holistic approach to aquarium maintenance. 
        By following the strategies outlined in this guide, you can effectively combat BBA and prevent its return.
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
        "headline": "How to Control Black Beard Algae (BBA) in Planted Aquariums",
        "description": "Learn effective methods to eliminate and prevent Black Beard Algae in your planted aquarium with this comprehensive guide.",
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
    
    // Check if we found any content, provide a fallback if not
    const contentHtml = articleContent.html() || `
      <p class="text-lg font-medium leading-7 mb-6">
        Black Beard Algae (BBA), also known as brush algae, is one of the most stubborn and common problems in planted aquariums. 
        This comprehensive guide will show you effective methods to control and eliminate Black Beard Algae from your tank, 
        ensuring a healthier environment for your aquatic plants and fish.
      </p>
      <h2 id="what-is-black-beard-algae" class="text-2xl font-bold mt-8 mb-4">What is Black Beard Algae - Black Beard Algae Control</h2>
      <p class="mb-4">
        Black Beard Algae (BBA) is a type of red algae (Rhodophyta) that appears as dark tufts or spots on aquarium surfaces.
        It's particularly fond of growing on slow-growing plants, hardscape, and equipment in areas with moderate to high water flow.
      </p>
      <h2 id="causes-of-bba" class="text-2xl font-bold mt-8 mb-4">Main Causes of BBA - Black Beard Algae Control</h2>
      <p class="mb-4">
        The primary cause of Black Beard Algae is inconsistent or insufficient CO2 levels in planted tanks.
        Other contributing factors include:
      </p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Fluctuating CO2 levels (most common cause)</li>
        <li class="mb-2">Organic waste buildup</li>
        <li class="mb-2">Inconsistent maintenance routines</li>
        <li class="mb-2">High phosphate levels</li>
        <li class="mb-2">Aged filter media or substrate</li>
      </ul>
      <h2 id="how-to-remove-bba" class="text-2xl font-bold mt-8 mb-4">How to Remove Black Beard Algae - Black Beard Algae Control</h2>
      <p class="mb-4">
        For immediate removal:
      </p>
      <ol class="list-decimal pl-6 mb-6">
        <li class="mb-2">Spot treat with hydrogen peroxide (H2O2) using a syringe</li>
        <li class="mb-2">Use liquid carbon products directly on affected areas</li>
        <li class="mb-2">Remove affected leaves or hardscape for cleaning outside the tank</li>
        <li class="mb-2">Introduce algae-eating species like Siamese Algae Eaters or Amano Shrimp</li>
      </ol>
      <h2 id="preventing-bba" class="text-2xl font-bold mt-8 mb-4">Preventing Black Beard Algae - Black Beard Algae Control</h2>
      <p class="mb-4">
        For long-term prevention:
      </p>
      <ul class="list-disc pl-6 mb-6">
        <li class="mb-2">Maintain stable and appropriate CO2 levels (if using CO2)</li>
        <li class="mb-2">Perform regular water changes (25-50% weekly)</li>
        <li class="mb-2">Clean filter media monthly without over-cleaning</li>
        <li class="mb-2">Maintain a balance between light and nutrients</li>
        <li class="mb-2">Remove organic waste regularly</li>
        <li class="mb-2">Ensure proper water flow throughout the tank</li>
      </ul>
    `;
    
    // Add a container with proper styling
    const optimizedContent = `
      <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="text-3xl md:text-4xl font-bold mb-6">How to Control Black Beard Algae (BBA) in Planted Aquariums</h1>
        <div class="prose prose-lg dark:prose-invert max-w-none">
          ${contentHtml}
        </div>
        ${schemaMarkup}
      </div>
    `;
    
    // Download images
    for (const image of images) {
      await downloadImage(image.originalSrc, image.localPath);
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
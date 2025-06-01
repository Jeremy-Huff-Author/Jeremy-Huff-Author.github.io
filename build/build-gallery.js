const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const sharp = require("sharp");
const slugify = require("slugify");
const axios = require('axios');

// Initialize Notion client (replace with your integration token)
const notion = new Client({ auth: process.env.NOTION_TOKEN });

// Replace with your database ID
const databaseId = process.env.NOTION_LOCATION_DB_ID;

const galleryEntries = [];
const galleryDir = "gallery";

// Function to remove existing subdirectories in gallery
const cleanGalleryDirectory = () => {
  if (fs.existsSync(galleryDir)) {
    fs.readdirSync(galleryDir, { withFileTypes: true }).forEach(dirent => {
      const fullPath = path.join(galleryDir, dirent.name);
      if (dirent.isDirectory()) {
        fs.rmSync(fullPath, { recursive: true, force: true });
      }
    });
  }
}

const buildGallery= async () => {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Featured',
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        { property: 'Name', direction: 'ascending' },
      ],
    });

    // Clean the gallery directory before building
    cleanGalleryDirectory();

    for (const location of response.results) {
      const locationName = location.properties.Name.title[0].plain_text;
      const locationSlug = slugify(locationName, { lower: true, strict: true });
      const locationDir = path.join("gallery", locationSlug);
      galleryEntries.push(locationDir);

      // Create directory for the location
      if (!fs.existsSync(locationDir)) {
        fs.mkdirSync(locationDir);
      }

      // Download and save cover image
      if (location.cover && location.cover.file && location.cover.file.url) {
        const coverUrl = location.cover.file.url;
        const coverPath = path.join(locationDir, "cover.jpg");
        try {
          const response = await axios({
            url: coverUrl,
            responseType: 'arraybuffer'
          });
          await sharp(response.data).toFile(coverPath);
        } catch (error) {
          console.error(`Error downloading cover image for ${locationName}:`, error);
        }
      }

      // Fetch and save page blocks as markdown (simplified - Notion API blocks need parsing)
      const blocksResponse = await notion.blocks.children.list({
        block_id: location.id,
        page_size: 100, // Adjust as needed
      });

      let markdownContent = '';
      // Basic handling - You'll need to expand this to properly convert Notion blocks to markdown
      for (const block of blocksResponse.results) {
        if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
          markdownContent += block.paragraph.rich_text[0].plain_text + '\n\n';
        }
      }
      fs.writeFileSync(path.join(locationDir, "content.md"), markdownContent);

      // Create empty custom-styles.css
      fs.writeFileSync(path.join(locationDir, "custom-styles.css"), "");

      galleryEntries.push({
 path: `${galleryDir}/${locationSlug}`
      });
    }

    fs.writeFileSync("gallery/manifest.json", JSON.stringify(galleryEntries, null, 2));
    console.log('Gallery built successfully!');

  } catch (error) {
    console.error('Error building gallery:', error);
  }
}

buildGallery();
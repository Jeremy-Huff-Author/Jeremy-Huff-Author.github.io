const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");
const axios = require("axios");
const sharp = require("sharp");

const { NOTION_POST_DATABASE_ID, NOTION_TOKEN } = process.env;

const postsDir = path.join("blog", "posts");
const manifestPath = path.join(__dirname, '..', "blog", "post-manifest.json");

const today = new Date().toISOString().split("T")[0];

function isPastOrToday(dateStr) {
  if (!dateStr) {
    return false;
}

  return dateStr <= today;
}

async function main() {
  if (!NOTION_POST_DATABASE_ID || !NOTION_TOKEN) {
    console.error("Please provide NOTION_POST_DATABASE_ID and NOTION_TOKEN environment variables.");
    process.exit(1);
}

  const notion = new Client({ auth: NOTION_TOKEN });

  // Ensure the posts directory exists
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  const posts = [];

  try {
    const response = await notion.databases.query({
      database_id: NOTION_POST_DATABASE_ID,
      filter: {
        property: "Publication Date",
        date: {
          on_or_before: today,
        },
      },
    });

    for (const page of response.results) {
      const pageId = page.id;
      const properties = page.properties;
      const title = properties.Name?.title?.[0]?.plain_text || 'Untitled'; // Handle untitled pages
      const date = properties["Publication Date"]?.date?.start || "";
      const summary = properties.Summary?.rich_text?.[0]?.plain_text || "";
      const coverImageUrl = page.cover?.file?.url || page.cover?.external?.url || ''; // Access cover image URL correctly
      const customStyles = properties["Custom Styles"]?.rich_text?.[0]?.plain_text || "";

      if (!title || !date || !isPastOrToday(date)) {
        console.log(`Skipping post with missing title, date, or future date: ${title || pageId}`);
        continue;
      }

      // Create a slug from the title
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      const postDirectory = path.join(postsDir, slug);

      // Fetch the content of the page
      const contentResponse = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100, // Adjust page size as needed
      });

      // Basic content extraction (you might need to enhance this based on your Notion block types)
      let content = "";
      for (const block of contentResponse.results) {
        if (block.type === "paragraph") {
          content += block.paragraph.rich_text.map(text => text.plain_text).join("") + "\n\n";
        } else if (block.type === "heading_1") {
          content += `# ${block.heading_1.rich_text.map(text => text.plain_text).join("")}\n\n`;
        } else if (block.type === "heading_2") {
          content += `## ${block.heading_2.rich_text.map(text => text.plain_text).join("")}\n\n`;
        } else if (block.type === "heading_3") {
          content += `### ${block.heading_3.rich_text.map(text => text.plain_text).join("")}\n\n`;
        } else if (block.type === "bulleted_list_item") {
          content += `- ${block.bulleted_list_item.rich_text.map(text => text.plain_text).join("")}\n`;
        } else if (block.type === "numbered_list_item") {
          // Notion API does not provide the number, so we'll just use the list item markdown
          content += `1. ${block.numbered_list_item.rich_text.map(text => text.plain_text).join("")}\n`;
        } else if (block.type === "to_do") {
          const checkbox = block.to_do.checked ? "[x]" : "[ ]";
          content += `- ${checkbox} ${block.to_do.rich_text.map(text => text.plain_text).join("")}\n`;
        } else if (block.type === "quote") {
          content += `> ${block.quote.rich_text.map(text => text.plain_text).join("")}\n\n`;
        } else if (block.type === "code") {
          const lang = block.code.language || "";
          const codeText = block.code.rich_text.map(text => text.plain_text).join("");
          content += `\n\n\`\`\`${lang}\n${codeText}\n\`\`\`\n\n`;
        } else {
          // Handle other block types as needed, or ignore them
          console.log(`Skipping unsupported block type: ${block.type}`);
        }
      }


      // Ensure the post directory exists
      if (!fs.existsSync(postDirectory)) {
        fs.mkdirSync(postDirectory, { recursive: true });
      }

      let localCoverImagePath = "";
      if (coverImageUrl) {
        try {
          const response = await axios({
            url: coverImageUrl,            responseType: 'arraybuffer', // Get the image as a buffer
          });

          const imageBuffer = response.data;

          const image = sharp(imageBuffer);

          // Always convert to JPG and write
          const thumbnailOutputPath = path.join(postDirectory, 'thumbnail.jpg');
          const coverOutputPath = path.join(postDirectory, 'cover.jpg');

          await image.jpeg({ quality: 60 }).toFile(thumbnailOutputPath);
          await image.jpeg({ quality: 80 }).toFile(coverOutputPath);

          console.log(`Downloaded cover image for ${title}`);
        } catch (error) {
          console.error(`Error downloading cover image for ${title}:`, error.message);
          localCoverImagePath = ""; // Reset if download fails
        }
      }

      // Write index.json
      const postMetadata = {
        id: pageId,
        title,
        date,
        summary
      };

      fs.writeFileSync(path.join(postDirectory, "index.json"), JSON.stringify(postMetadata, null, 2));

      // Write custom-styles.css if custom styles exist
      if (customStyles) {
        fs.writeFileSync(path.join(postDirectory, "custom-styles.css"), customStyles);
        console.log(`Wrote custom styles for ${title}`);
      }

      // Write index.md
      fs.writeFileSync(path.join(postDirectory, "index.md"), content);

      posts.push({
        title,
        date,
        summary,
      });
    }

    fs.writeFileSync(manifestPath, JSON.stringify(posts, null, 2));
    console.log(`✅ Wrote ${posts.length} posts to ${manifestPath}`);

  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error);
  }
}

main();

const fs = require("fs");
const path = require("path");
const xml2js = require('xml2js');
const { Client } = require("@notionhq/client");
const axios = require("axios");
const sharp = require("sharp");

const { NOTION_POST_DATABASE_ID, NOTION_TOKEN } = process.env;

const postsDir = path.join("blog", "posts");
const manifestPath = path.join(__dirname, '..', "blog", "post-manifest.json");

const sitemapPath = path.join(__dirname, '..', "sitemap.xml");
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

  // Read and parse existing sitemap
  let sitemap = {};
  let sitemapExists = fs.existsSync(sitemapPath);

  if (sitemapExists) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf-8');
    try {
      sitemap = await xml2js.parseStringPromise(sitemapContent, { explicitArray: false });
    } catch (error) {
      console.error("Error parsing existing sitemap.xml:", error);
      // Initialize with a basic structure if parsing fails
      sitemap = {
        urlset: {
          $: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
          url: []
        }
      };
    }
  } else {
    // Initialize with a basic structure if sitemap doesn't exist
    sitemap = {
      urlset: {
        $: { xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9' },
        url: []
      }
    };
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

      if (!fs.existsSync(postDirectory)) {
        fs.mkdirSync(postDirectory, { recursive: true });
      }

      // Fetch the content of the page
      const contentResponse = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100, // Adjust page size as needed
      });

      // Basic content extraction (you might need to enhance this based on your Notion block types)
      let content = "";
      let imageCount = 0;
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
        } else if (block.type === "image") {
          const imageUrl = block.image.file?.url || block.image.external?.url;
          const caption = block.image.caption.map(t => t.plain_text).join("");
          if (imageUrl) {
            try {
              imageCount += 1;
              const urlObj = new URL(imageUrl);
              const ext = path.extname(urlObj.pathname) || '.jpg';
              const imageName = `image-${imageCount}${ext}`;
              const outputPath = path.join(postDirectory, imageName);
              const response = await axios({ url: imageUrl, responseType: 'arraybuffer' });
              await sharp(response.data).toFile(outputPath);
              content += `![${caption}](/blog/posts/${slug}/${imageName})\n\n`;
            } catch (err) {
              console.error(`Error downloading image for ${title}:`, err.message);
            }
          }
        } else {
          // Handle other block types as needed, or ignore them
          console.log(`Skipping unsupported block type: ${block.type}`);
        }
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
      fs.writeFileSync(path.join(postDirectory, "custom-styles.css"), customStyles);
      console.log(`Wrote custom styles for ${title}`);

      // Write index.md
      fs.writeFileSync(path.join(postDirectory, "index.md"), content);

      posts.push({
        title,
        date,
        summary,
        path: `blog/posts/${slug}` // Add the relative path here
      });
    }

    // Sort posts by date in descending order
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    fs.writeFileSync(
      manifestPath,
      JSON.stringify(posts, null, 2)
    );

    console.log(`✅ Wrote ${posts.length} posts to ${manifestPath}`);

    // Add blog post sitemap entries
    const blogPostUrls = posts.map(post => `https://jeremythuff.page/blog/index.html?post=${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`);

    for (const blogPostUrl of blogPostUrls) {
      if (!sitemap.urlset.url.some(urlEntry => urlEntry.loc === blogPostUrl)) {
        sitemap.urlset.url.push({ loc: blogPostUrl });
      }
    }

    // Build and write updated sitemap
    const builder = new xml2js.Builder();
    const updatedSitemapContent = builder.buildObject(sitemap);

    fs.writeFileSync(sitemapPath, updatedSitemapContent);
    console.log(`✅ Updated sitemap.xml with blog post entries.`);
  } catch (error) {
    console.error("Error fetching blog posts from Notion:", error);
  }
}

main();

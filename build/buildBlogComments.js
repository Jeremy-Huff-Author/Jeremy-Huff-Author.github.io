const fs = require("fs");
const path = require("path");
const { Client } = require("@notionhq/client");

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

async function fetchComments() {
  let results = [];
  let cursor = undefined;

  // Paginate through all results
  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: "comment_approved",
        checkbox: { equals: true }
      },
      start_cursor: cursor,
    });

    results = results.concat(response.results);
    cursor = response.has_more ? response.next_cursor : null;
  } while (cursor);

  console.log(`✅ Retrieved ${results.length} approved comments`);

  const grouped = {};

  for (const page of results) {
    try {
      const props = page.properties;

      const postUrl = props["post_id"]?.url;
      const name = props["commenter_name"]?.rich_text?.[0]?.plain_text || "Anonymous";
      const comment = props["comment_text"]?.rich_text?.[0]?.plain_text || "";
      const date = props["comment_date"]?.date?.start || null;

      if (!postUrl) {
        console.warn("⚠️ Skipped comment with missing post_id URL");
        continue;
      }

      const slug = extractSlugFromUrl(postUrl);
      if (!slug) {
        console.warn(`⚠️ Could not extract slug from URL: ${postUrl}`);
        continue;
      }

      if (!grouped[slug]) grouped[slug] = [];

      grouped[slug].push({ name, comment, date });

    } catch (err) {
      console.warn("⚠️ Skipped malformed comment:", err.message);
    }
  }

  for (const slug in grouped) {
    const postDir = path.join("blog", "posts", slug);
    const outFile = path.join(postDir, "comments.json");

    fs.mkdirSync(postDir, { recursive: true });
    fs.writeFileSync(outFile, JSON.stringify(grouped[slug], null, 2));

    console.log(`📁 Wrote ${grouped[slug].length} comments to ${outFile}`);
  }

  console.log("✅ Done writing all comment files");
}

// 🔧 Extract slug from URLs like:
// https://jeremythuff.page/blog/index.html?post=my-first-blog-post
function extractSlugFromUrl(url) {
  try {
    let safeUrl = url;
    // Prepend protocol if missing to handle URLs without one
    if (!safeUrl.startsWith("http://") && !safeUrl.startsWith("https://")) {
      safeUrl = "https://" + safeUrl;
    }
    const u = new URL(safeUrl);
    return u.searchParams.get("post");
  } catch (e) {
    return null;
  }
}

fetchComments().catch((err) => {
  console.error("❌ Failed to fetch comments:", err);
  process.exit(1);
});

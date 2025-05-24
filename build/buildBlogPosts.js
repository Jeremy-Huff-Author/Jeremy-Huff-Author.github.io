const fs = require("fs");
const path = require("path");

const postsDir = path.join("blog", "posts");
const manifestPath = path.join("blog", "post-manifest.json");

const today = new Date().toISOString().split("T")[0];

function loadPostIndex(dirPath) {
  const indexFile = path.join(dirPath, "index.json");
  if (!fs.existsSync(indexFile)) return null;

  try {
    const json = JSON.parse(fs.readFileSync(indexFile, "utf-8"));
    return json;
  } catch (e) {
    console.warn(`Skipping malformed index.json in ${dirPath}`);
    return null;
  }
}

function isPastOrToday(dateStr) {
  return dateStr <= today;
}

function main() {
  const postDirs = fs.readdirSync(postsDir).filter(dir =>
    fs.statSync(path.join(postsDir, dir)).isDirectory()
  );

  const posts = [];

  for (const dir of postDirs) {
    const fullDir = path.join(postsDir, dir);
    const post = loadPostIndex(fullDir);
    if (!post || !isPastOrToday(post.date)) {
      console.log(`Skipping future or invalid post: ${dir}`);
      continue;
    }
    posts.push(post);
  }

  fs.writeFileSync(manifestPath, JSON.stringify(posts, null, 2));
  console.log(`✅ Wrote ${posts.length} posts to ${manifestPath}`);
}

main();

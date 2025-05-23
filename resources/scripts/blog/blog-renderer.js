// Get the value of the 'post' query string parameter
const postsListContainer = document.getElementById('posts-list');
const postContentContainer = document.getElementById('post-content');
const urlParams = new URLSearchParams(window.location.search);
const initialPostName = urlParams.get('post');

const convertTitleToDirName = (title) => {
  return title.toLowerCase().replace(/\s+/g, '-');
};

const renderPost = (postName) => {
  const postFolderPath = `posts/${postName}`;
  const markdownFilePath = `${postFolderPath}/index.md`;
  const jsonFilePath = `${postFolderPath}/index.json`;

  // Fetch the JSON metadata and markdown content concurrently
  Promise.all([
    fetch(jsonFilePath).then(response => response.json()),
    fetch(markdownFilePath).then(response => response.text())
  ])
  .then(([metadata, markdownContent]) => {
    // Convert markdown to HTML using marked.parse()
    const htmlContent = marked.parse(markdownContent);
    // Set the innerHTML of the element with ID 'post-content'
    postContentContainer.innerHTML = `
    <h1>${metadata.title}</h1>
    <p class="text-muted">${metadata.date}</p>
    ${htmlContent}`;
  })
  .catch(error => console.error('Error fetching post data:', error));
}

// Fetch the post manifest
fetch('post-manifest.json')
.then(response => response.json())
.then(postManifest => {
  // Populate the posts list
  if (postManifest) {
    postManifest.forEach(post => {
      const listItem = document.createElement('a');
      listItem.classList.add('list-group-item', 'list-group-item-action');
      listItem.href = `/blog/index.html?post=${convertTitleToDirName(post.title)}`; // Use hash for navigation
      listItem.textContent = post.title;
      postsListContainer.appendChild(listItem);
    });
  } else {
    console.error(postManifest)
  }

  // Render the initial post based on the query parameter
  if (initialPostName) {
    renderPost(initialPostName);
  }
});



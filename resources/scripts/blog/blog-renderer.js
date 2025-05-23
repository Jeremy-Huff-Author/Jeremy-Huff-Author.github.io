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
    
 // Assuming there is a container element with the ID 'blog-post-container'
    const blogPostContainer = document.getElementById('blog-post-container'); 
    blogPostContainer.style.position = 'relative'; // Make the container relative for absolute positioning of text

 const thumbnailImg = document.createElement('img');
 thumbnailImg.src = `./posts/${postName}/thumbnail.png`; // Use postName to construct the path
 thumbnailImg.alt = `${metadata.title} Thumbnail`;
 thumbnailImg.classList.add('blog-hero-image'); // Add a class for styling

    const textOverlay = document.createElement('div');
 textOverlay.style.position = 'absolute';
 textOverlay.style.bottom = '0';
 textOverlay.style.left = '0';
 textOverlay.style.right = '0';
 textOverlay.style.padding = '20px';
 textOverlay.style.color = 'white';
 textOverlay.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';

    const titleElement = document.createElement('h1');
 titleElement.innerText = metadata.title;

    const dateElement = document.createElement('p');
 dateElement.innerText = new Date(metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

 textOverlay.appendChild(titleElement);
 textOverlay.appendChild(dateElement);

 // Clear existing content and add the new structure
    postContentContainer.innerHTML = ''; // Clear existing content in post-content
    postContentContainer.appendChild(thumbnailImg);
 postContentContainer.appendChild(textOverlay);
    postContentContainer.innerHTML += htmlContent; // Add the body content
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



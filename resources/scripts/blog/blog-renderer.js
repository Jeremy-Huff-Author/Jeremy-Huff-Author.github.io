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
    // Clear existing content
    postContentContainer.innerHTML = '';

    // Create the hero section
    const heroSection = document.createElement('div');
    heroSection.classList.add('position-relative', 'd-flex', 'align-items-end', 'text-white', 'p-5');
    heroSection.style.backgroundImage = `url(./posts/${postName}/thumbnail.png)`;
    heroSection.style.backgroundSize = 'cover';
    heroSection.style.backgroundPosition = 'center';
    heroSection.style.minHeight = '400px';

    const textOverlay = document.createElement('div');
    textOverlay.classList.add('text-shadow'); // Assuming you have a CSS class for text-shadow

    const titleElement = document.createElement('h1');
    titleElement.innerText = metadata.title;
    titleElement.classList.add('mb-0');

    const dateElement = document.createElement('p');
    dateElement.innerText = new Date(metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    dateElement.classList.add('mb-0');

    textOverlay.appendChild(titleElement);
    textOverlay.appendChild(dateElement);
    postContentContainer.appendChild(textOverlay);
    postContentContainer.innerHTML += markdownContent; // Add the body content
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



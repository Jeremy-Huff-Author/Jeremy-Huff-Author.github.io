// Get the value of the 'post' query string parameter
const postsListContainer = document.getElementById('posts-list');
const postContentContainer = document.getElementById('post-content');
const urlParams = new URLSearchParams(window.location.search);
const initialPostName = urlParams.get('post');
console.log(initialPostName);
if(initialPostName === '') {
  const offcanvasElement = document.getElementById('offcanvas');
  const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
  if (offcanvas) {
    offcanvas.show();
  }
}

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
    heroSection.classList.add('blog-hero', 'position-relative', 'd-flex', 'align-items-end', 'text-white', 'p-5', 'mb-5');
    document.documentElement.style.setProperty('--blog-hero-background-image', `url(/blog/posts/${postName}/thumbnail.png)`);

    const textOverlay = document.createElement('div');
    textOverlay.classList.add('text-shadow');

    const titleElement = document.createElement('h1');
    titleElement.innerText = metadata.title;
    titleElement.classList.add('mb-0');

    const dateElement = document.createElement('p');
    dateElement.innerText = new Date(metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    dateElement.classList.add('mb-0');

    textOverlay.appendChild(titleElement);
    textOverlay.appendChild(dateElement);
    heroSection.appendChild(textOverlay);
    postContentContainer.appendChild(heroSection);

    const htmlContent = window.marked.parse(markdownContent);
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

      if(initialPostName === convertTitleToDirName(post.title)) {
        listItem.classList.add('active');
      }

      listItem.href = `/blog/index.html?post=${convertTitleToDirName(post.title)}`; // Use hash for navigation
      listItem.innerHTML = `<li class="list-group-item">
        <div class="ms-2 me-auto">
          <div class="fw-bold">${post.title}</div>
          ${post.date}
        </div>
      </li>`;
      postsListContainer.appendChild(listItem);

      listItem.addEventListener('click', (event) => {
        // Prevent default navigation
        event.preventDefault();
        // Close the offcanvas pane (assuming it has an ID 'offcanvasNavbar')
        const offcanvasElement = document.getElementById('offcanvas');
        const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
        if (offcanvas) {
          offcanvas.hide();
        }
        // Only navigate if the item is not already active
        if (!listItem.classList.contains('active')) {
          // Remove active class from all list items
          postsListContainer.querySelectorAll('.list-group-item').forEach(item => {
            item.classList.remove('active');
          });
          // Add active class to the clicked list item
          listItem.classList.add('active');
          // Wait 500ms before navigating
          setTimeout(() => { window.location.href = listItem.href; }, 500);
        }
      });
    });
  } else {
    console.error(postManifest)
  }

  // Render the initial post based on the query parameter
  if (initialPostName) {
    renderPost(initialPostName);
  }
});



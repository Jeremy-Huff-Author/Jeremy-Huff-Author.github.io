// Get the value of the 'post' query string parameter
const postsListContainer = document.getElementById('posts-list');
const postContentContainer = document.getElementById('post-content');
const urlParams = new URLSearchParams(window.location.search);
const initialPostName = urlParams.get('post');

if(!initialPostName) {
  const offcanvasElement = document.getElementById('offcanvas');
  const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
  if (!!offcanvas) {
    offcanvas.show();
  }
}

const renderPost = () => {
  const postFolderPath = `posts/${initialPostName}`;
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
    
    // Assume cover image is always .jpg
    const coverJpgPath = `../../blog/${postFolderPath}/cover.jpg`;
    document.documentElement.style.setProperty('--blog-hero-background-image', `url(${coverJpgPath})`);
    
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

    gtag('event', 'page_view', {
      page_path: `/blog/${initialPostName}`,
      page_title: initialPostName.replace(/-/g, ' ') // optional
    });
    
    // Fetch and apply custom styles
    const customStylesPath = `${postFolderPath}/custom-styles.css`;
    fetch(customStylesPath)
    .then(response => response.text())
    .then(cssContent => {
      const styleTag = document.createElement('style');
      styleTag.textContent = cssContent;
      document.head.appendChild(styleTag);
    })
    .catch(error => console.error('Error fetching custom styles:', error));
    
    const commentFormLauncher = document.getElementById('comment-form-launcher');
    if(commentFormLauncher) {
      commentFormLauncher.classList.remove('d-none');
    }
    
    checkFooterSticky();
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

      if(initialPostName === post.path.split('/').pop()) {
        listItem.classList.add('active');
      }

      listItem.href = `/blog/index.html?post=${post.path}`; // Use hash for navigation
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
        // Close the offcanvas pane (assuming it has an ID 'offcanvas')
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
    renderPost();
  }
});



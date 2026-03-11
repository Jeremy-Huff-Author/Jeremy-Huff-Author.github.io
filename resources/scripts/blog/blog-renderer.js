// Get the value of the 'post' query string parameter
const postsListContainer = document.getElementById('posts-list');
const postContentContainer = document.getElementById('post-content');
const postsFilterInput = document.getElementById('posts-filter');
const postsTagsToggle = document.getElementById('posts-tags-toggle');
const postsTagsMenu = document.getElementById('posts-tags-menu');
const urlParams = new URLSearchParams(window.location.search);
const initialPostName = urlParams.get('post');
let filterDebounceId = null;
let activeTag = null;
const TAG_COLOR_COUNT = 6;
const TAG_COLOR_MAP = {
  updates: 'tag-badge-updates',
  'the writing process': 'tag-badge-writing',
  lore: 'tag-badge-lore',
  personal: 'tag-badge-personal',
  microfiction: 'tag-badge-microfiction'
};

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#39;');

const normalizeTag = (tag) => String(tag || '').trim().toLowerCase();

const getTagColorIndex = (tag) => {
  let hash = 0;
  for (let i = 0; i < tag.length; i += 1) {
    hash = (hash * 31 + tag.charCodeAt(i)) % TAG_COLOR_COUNT;
  }
  return hash;
};

const resolveTagClass = (tag) => {
  const normalized = normalizeTag(tag);
  if (TAG_COLOR_MAP[normalized]) {
    return TAG_COLOR_MAP[normalized];
  }
  return `tag-badge-${getTagColorIndex(normalized)}`;
};

const renderTags = (tags) => {
  if (!Array.isArray(tags) || tags.length === 0) return '';
  return `<div class="post-tags">${tags.map(tag => {
    const tagClass = resolveTagClass(tag);
    return `<span class="post-tag ${tagClass}">${escapeHtml(tag)}</span>`;
  }).join('')}</div>`;
};

const applyPostFilter = () => {
  if (!postsListContainer) return;
  const query = postsFilterInput ? postsFilterInput.value.trim().toLowerCase() : '';
  const activeTagQuery = activeTag;
  postsListContainer.querySelectorAll('[data-title]').forEach(item => {
    const title = (item.dataset.title || '').toLowerCase();
    const tags = (item.dataset.tags || '').split('|').filter(Boolean);
    const matchesTitle = title.includes(query);
    const matchesTag = !activeTagQuery || tags.includes(activeTagQuery);
    item.style.display = matchesTitle && matchesTag ? '' : 'none';
  });
};

const handleFilterInput = () => {
  if (!postsListContainer || !postsFilterInput) return;
  postsListContainer.classList.add('is-typing');
  if (filterDebounceId) {
    clearTimeout(filterDebounceId);
  }
  filterDebounceId = setTimeout(() => {
    postsListContainer.classList.remove('is-typing');
    applyPostFilter();
  }, 250);
};

if (postsFilterInput) {
  postsFilterInput.addEventListener('input', handleFilterInput);
}

const setTagsMenuOpen = (isOpen) => {
  if (!postsTagsMenu || !postsTagsToggle) return;
  postsTagsMenu.classList.toggle('is-open', isOpen);
  postsTagsToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
};

const updateTagButtons = () => {
  if (!postsTagsMenu) return;
  postsTagsMenu.querySelectorAll('[data-tag]').forEach(button => {
    const isActive = activeTag === button.dataset.tag;
    button.classList.toggle('is-active', isActive);
    button.classList.toggle('is-inactive', !!activeTag && !isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const setActiveTag = (tag) => {
  activeTag = tag;
  updateTagButtons();
  applyPostFilter();
};

const toggleTagFilter = (tag) => {
  const normalized = normalizeTag(tag);
  if (!normalized) return;
  if (activeTag === normalized) {
    setActiveTag(null);
    return;
  }
  setActiveTag(normalized);
};

if (postsTagsToggle && postsTagsMenu) {
  postsTagsToggle.addEventListener('click', () => {
    const isOpen = postsTagsMenu.classList.contains('is-open');
    setTagsMenuOpen(!isOpen);
  });
}

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
    const tagDisplayMap = new Map();
    postManifest.forEach(post => {
      const listItem = document.createElement('a');
      listItem.classList.add('list-group-item', 'list-group-item-action');
      listItem.dataset.title = post.title || '';
      const normalizedTags = Array.isArray(post.tags)
        ? post.tags.map(normalizeTag).filter(Boolean)
        : [];
      listItem.dataset.tags = normalizedTags.join('|');

      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => {
          const normalized = normalizeTag(tag);
          if (normalized && !tagDisplayMap.has(normalized)) {
            tagDisplayMap.set(normalized, String(tag).trim());
          }
        });
      }

      if(initialPostName === post.path.split('/').pop()) {
        listItem.classList.add('active');
      }

      const tagsMarkup = renderTags(post.tags);
      listItem.href = `/blog/index.html?post=${post.path.split('/').pop()}`; // Use hash for navigation
      listItem.innerHTML = `<li class="list-group-item">
        <div class="ms-2 me-auto">
          <div class="fw-bold">${post.title}</div>
          <div class="post-meta">
            <span class="post-date">${post.date}</span>
            ${tagsMarkup}
          </div>
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

    if (postsTagsMenu && tagDisplayMap.size > 0) {
      const tagsToRender = Array.from(tagDisplayMap.entries())
        .sort((a, b) => a[1].localeCompare(b[1], undefined, { sensitivity: 'base' }));
      postsTagsMenu.innerHTML = '';
      tagsToRender.forEach(([normalized, label]) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `post-tag tag-filter-pill ${resolveTagClass(label)}`;
        button.textContent = label;
        button.dataset.tag = normalized;
        button.setAttribute('aria-pressed', 'false');
        button.addEventListener('click', () => toggleTagFilter(normalized));
        postsTagsMenu.appendChild(button);
      });
      updateTagButtons();
    }
  } else {
    console.error(postManifest)
  }

  applyPostFilter();

  // Render the initial post based on the query parameter
  if (initialPostName) {
    renderPost();
  }
});

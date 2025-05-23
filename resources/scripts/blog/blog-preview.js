document.addEventListener('DOMContentLoaded', () => {
    fetch('../../blog/post-manifest.json')
        .then(response => {
            if (!response.ok) {
                
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(posts => {

            // Sort posts by date descending and take the first two
            const recentPosts = posts.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 2);

            const postsContainer = document.querySelector('.blog'); // Assuming you have an element with this class
            if (!postsContainer) {
                console.error('Element with class "blog" not found.');
            }

            recentPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = compileBlogPostPreview(post);
                postElement.classList.add('col-md-6'); // Adjust column class if needed
                postsContainer.appendChild(postElement);
            });
        })
        .catch(error => {
            console.error('Error fetching blog posts:', error);
            const postsContainer = document.querySelector('.blog');
            if (postsContainer) {
                postsContainer.innerHTML = '<p>Failed to load blog posts.</p>';
            }
        });
});

const convertTitleToDirName = (title) => {
    return title.toLowerCase().replace(/\s+/g, '-');
};

const compileBlogPostPreview = (post) => {
    const blogPreview = `
    <div class="blog-post-preview mb-4">
        <a role="button" class="text-reset text-decoration-none" href="./blog/index.html?post=${convertTitleToDirName(post.title)}">
            <img class="blog-thumbnail" src="./blog/posts/${convertTitleToDirName(post.title)}/thumbnail.png" alt="${post.title}" class="rounded">
        </a>
        <div class="d-flex flex-column">
            <a role="button" class="text-reset text-decoration-none" href="./blog/index.html?post=${convertTitleToDirName(post.title)}">
                <small>${new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</small>
                <h4 class="mt-3">${post.title}</h4>
                <p>"${post.description}"</p>
            </a>
        </div>
    </div>
    `
    return blogPreview;
};
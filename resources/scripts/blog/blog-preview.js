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
            recentPosts.reverse();

            const postsContainer = document.querySelector('.blog'); // Assuming you have an element with this class
            if (!postsContainer) {
                console.error('Element with class "blog" not found.');
            }

            recentPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = compileBlogPostPreview(post);
                postElement.classList.add('col-md-5'); // Adjust column class if needed
                postsContainer.prepend(postElement);
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

const compileBlogPostPreview = (post) => {
    const blogPreview = `
    <div class="blog-post-preview mb-4">
 <a role="button" class="text-reset text-decoration-none" href="./blog/index.html?post=${post.path.split('/').pop()}">
 <img class="blog-thumbnail" src="${post.path}/thumbnail.jpg" alt="${post.title}" class="rounded">
        </a>
        <div class="d-flex flex-column">
 <a role="button" class="text-reset text-decoration-none" href="./blog/index.html?post=${post.path.split('/').pop()}">
                <small>${new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</small>
                <h4 class="mt-3">${post.title}</h4>
                <p>"${post.summary}"</p>
            </a>
        </div>
    </div>
 `;
    return blogPreview;
};
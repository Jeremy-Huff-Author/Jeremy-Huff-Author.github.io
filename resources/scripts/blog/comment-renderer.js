document.addEventListener('DOMContentLoaded', () => {
    const commentsSection = document.getElementById('comments-section');

    if (!commentsSection) {
        console.error('Comments section div with id "comments-section" not found.');
        return;
    }

    // Function to extract slug from URL (similar to build/buildBlogComments.js)
    const extractSlugFromUrl = (url) => {
        try {
            // Prepend https:// if not present to handle relative URLs or those without protocol
            let fullUrl = url;
            if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
                fullUrl = `https://example.com${fullUrl}`; // Use a dummy domain
            }
            const urlObject = new URL(fullUrl);
            const params = new URLSearchParams(urlObject.search);
            return params.get('post');
        } catch (error) {
            console.error('Error extracting slug from URL:', error);
            return null;
        }
    };

    const currentSlug = extractSlugFromUrl(window.location.href);

    if (!currentSlug) {
        console.warn('Could not extract blog post slug from URL. Comments not loaded.');
        return;
    }

    const commentsFilePath = `/blog/posts/${currentSlug}/comments.json`;

    fetch(commentsFilePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(comments => {
            if (comments && comments.length > 0) {
                comments.forEach(comment => {
                    const commentHTML = `
                        <div class="comment">
                            <p class="comment-meta">
                                <span class="comment-author">${comment.name || 'Anonymous'}</span>
                                <span class="comment-date">${new Date(comment.date).toLocaleDateString()}</span>
                            </p>
                            <p class="comment-content">${comment.comment}</p>
                        </div>
                    `;
                    commentsSection.innerHTML += commentHTML;

                });
            } else {
                const noCommentsElement = document.createElement('p');
                noCommentsElement.textContent = 'No comments yet.';
                commentsSection.appendChild(noCommentsElement);
            }
        })
        .catch(error => {
            console.error('Error fetching or rendering comments:', error);
            const errorElement = document.createElement('p');
            errorElement.textContent = 'Error loading comments.';
            commentsSection.appendChild(errorElement);
        });
});
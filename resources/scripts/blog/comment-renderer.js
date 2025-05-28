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

    const commentsEndpoint = `https://jeremythuff.netlify.app/.netlify/functions/comment-handler?post_id=${currentSlug}`;

    fetch(commentsEndpoint)
        .then(response => {
            if (!response.ok) {
                // If the response is 204 No Content or 404 Not Found, it means no comments
                // Although the API should return 200 with an empty array for no comments,
                // this provides a fallback for potential different API behaviors.
                if (response.status === 204 || response.status === 404) {
                    return null; // Return null to indicate no comments
                } else {
                    // For other HTTP errors, throw an error
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
            }
            return response.json();
        })
        .then(comments => {
            if (comments && comments.length > 0) {
                comments.forEach(comment => {
                    const commentHTML = `
                    <div class="card mb-3">
                        <div class="card-body">
                            <h6 class="card-subtitle mb-2 text-body-secondary float-end">${new Date(comment.date).toLocaleDateString()}</h6>                            
                            <h5 class="card-title">${comment.name || 'Anonymous'}</h5>
                            <hr>
                            <p class="card-text">${comment.comment}</p>
                            <!--<a href="#" class="card-link text-dark">Reply</a>
                            <a href="#" class="card-link text-danger">Report</a>-->
                        </div>
                    </div>
                    `;
                    commentsSection.innerHTML += commentHTML;

                });
                checkFooterSticky();
            } else {
                const noCommentsElement = document.createElement('p');
                noCommentsElement.textContent = 'No comments yet.';
                commentsSection.appendChild(noCommentsElement);
                checkFooterSticky();
            }
        })
        .catch(error => {
            // Check if the error is due to a 404 status from the fetch call
            const errorMessage = error instanceof Error && error.message.includes('HTTP error! status: 404')
                ? 'No Comments, be the first to leave one!'
                : 'Error loading comments.';

            const errorElement = document.createElement('p');
            errorElement.textContent = errorMessage;
            commentsSection.appendChild(errorElement);
            checkFooterSticky();
        });
});
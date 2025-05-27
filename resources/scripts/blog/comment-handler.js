document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form'); // Assuming your form has this ID
    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            commentForm.querySelectorAll('input, select, textarea, button').forEach(element => {
                element.disabled = true;
            });

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

            grecaptcha.ready(function() {
                grecaptcha.execute('6Lfr2EgrAAAAAEUh6j5JqZxhf8FqUiy2a--73wja', {action: 'submit'}).then(recaptchaToken => {
                    
                    const name = commentForm.querySelector('[name="commenter_name"]').value;
                    const email = commentForm.querySelector('[name="commenter_email"]').value;
                    const comment = commentForm.querySelector('[name="comment_text"]').value;
                    const post_id = currentSlug;
                    const comment_date = new Date().toISOString();

                    console.log(!!name, !!email, !!comment);
                    console.log(name, email, comment);
                    if (!!name && !!email && !!comment) {                        console.log('Name:', name);
                        console.log('Email:', email);
                        console.log('Comment:', comment);
                        console.log('Comment Date:', comment_date);
                        console.log('Post ID:', post_id);

                        fetch('https://jeremythuff.netlify.app/.netlify/functions/comment-handler', {
                                method: 'POST',
                                body: JSON.stringify({
                                    name,
                                    email,
                                    comment,
                                    comment_date,
                                    post_id,
                                    recaptchaToken
                                }),
                            })
                            .then(response => {
                                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                                return response.json();
                            })
                            .then(data => {
                                console.log('Comment submitted successfully:', data);
                                // Close the modal after successful submission
                                const commentModal = document.getElementById('comment-modal');
                                if (commentModal) {
                                    const modal = bootstrap.Modal.getInstance(commentModal) || new bootstrap.Modal(commentModal);
                                    modal.hide();
                                    commentForm.reset(); // Reset the form after successful submission
                                    commentForm.querySelectorAll('input, select, textarea, button').forEach(element => {
                                        element.disabled = false;
                                    });
                                }
                            })
                            .catch(error => {
                                console.error('Error submitting comment:', error);
                                commentForm.querySelectorAll('input, select, textarea, button').forEach(element => {
                                    element.disabled = false;
                                });
                            });
                        
                    } else {
                        console.error('One or more form elements not found!');
                        commentForm.querySelectorAll('input, select, textarea, button').forEach(element => {
                            element.disabled = false;
                        });
                    }

                });
            });
        });
    } else {
        console.error('Comment form not found!');
    }
});
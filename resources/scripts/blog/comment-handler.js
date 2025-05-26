document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form'); // Assuming your form has this ID
    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            commentForm.querySelectorAll('input, select, textarea, button').forEach(element => {
                element.disabled = true;
            });


            grecaptcha.ready(function() {
                grecaptcha.execute('6Lfr2EgrAAAAAEUh6j5JqZxhf8FqUiy2a--73wja', {action: 'submit'}).then(function(token) {
                    
                    const name = commentForm.querySelector('[name="commenter_name"]').value;
                    const email = commentForm.querySelector('[name="commenter_email"]').value;
                    const comment = commentForm.querySelector('[name="comment_text"]').value;
                    const post_id = window.location.href;
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
                                    post_id
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
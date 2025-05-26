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
                    
                    const formData = new FormData(commentForm);
                    formData.append('post_id', window.location.href);
                    formData.append('comment_date', new Date().toISOString());
                    formData.append('recaptchaToken', token);
                    
                    // Access data from the FormData object using input names
                    const name = formData.get('commenter_name'); // Assuming your name input has name="name"
                    const email = formData.get('commenter_email'); // Assuming your email input has name="email"
                    const comment = formData.get('comment_text');
                    const post_id = formData.get('post_id');

                    if(!!name || !!email || !!comment) {
                        // Log the collected data to the console
                        console.log('Comment Data:');
                        console.log('Name:', name);
                        console.log('Email:', email);
                        console.log('Comment:', comment);
                        console.log('Comment Date:', formData.get('comment_date'));
                        console.log('Post ID:', post_id);

                        const jsonData = {};
                        formData.forEach((value, key) => {
                            jsonData[key] = value;
                        });

                        fetch('https://jeremythuff.netlify.app/.netlify/functions/comment-handler', {
                            method: 'POST',
                            body: JSON.stringify(jsonData),
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
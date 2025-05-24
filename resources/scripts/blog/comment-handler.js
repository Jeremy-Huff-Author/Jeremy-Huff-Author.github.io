document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form'); // Assuming your form has this ID

    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(commentForm);
            formData.append('post_id', window.location.href);
            formData.append('comment_date', new Date().toISOString());
            
            // Access data from the FormData object using input names
            const name = formData.get('commenter_name'); // Assuming your name input has name="name"
            const email = formData.get('commenter_email'); // Assuming your email input has name="email"
            const comment = formData.get('comment_text');
            const post_id = formData.get('post_id');

            if(!!name && !!email && !!comment) {
                // Log the collected data to the console
                console.log('Comment Data:');
                console.log('Name:', name);
                console.log('Email:', email);
                console.log('Comment:', comment);
                console.log('Comment Date:', formData.get('comment_date'));
                console.log('Post ID:', post_id);

                // Submit the form data to the Netlify function
                fetch('https://comment-handler.netlify.app/.netlify/functions/comment-handler', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Comment submitted successfully:', data);
                })
                .catch(error => {
                    console.error('Error submitting comment:', error);
                });
                commentForm.reset(); // Reset the form after successful submission
                
            } else {
                console.error('One or more form elements not found!');
            }
        });
    } else {
        console.error('Comment form not found!');
    }
});
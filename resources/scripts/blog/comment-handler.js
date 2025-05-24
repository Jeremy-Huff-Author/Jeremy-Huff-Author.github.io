document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form'); // Assuming your form has this ID

    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            const formData = new FormData(commentForm);
            
            // Access data from the FormData object using input names
            const name = formData.get('commenter_name'); // Assuming your name input has name="name"
            const email = formData.get('commenter_email'); // Assuming your email input has name="email"
            const comment = formData.get('comment_text');

            if(!!name || !!email || !!comment) {
                // Log the collected data to the console
                console.log('Comment Data:');
                console.log('Name:', name);
                console.log('Email:', email);
                console.log('Comment:', comment);
                
            } else {
                console.error('One or more form elements not found!');
            }
        });
    } else {
        console.error('Comment form not found!');
    }
});
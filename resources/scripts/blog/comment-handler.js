document.addEventListener('DOMContentLoaded', () => {
    const commentForm = document.getElementById('comment-form'); // Assuming your form has this ID

    if (commentForm) {
        commentForm.addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent the default form submission

            const nameInput = document.getElementById('comment-name'); // Assuming your name input has this ID
            const emailInput = document.getElementById('comment-email'); // Assuming your email input has this ID
            const commentTextarea = document.getElementById('comment-text'); // Assuming your comment textarea has this ID

            if (nameInput && emailInput && commentTextarea) {
                const name = nameInput.value;
                const email = emailInput.value;
                const comment = commentTextarea.value;

                // Log the collected data to the console
                console.log('Comment Data:');
                console.log('Name:', name);
                console.log('Email:', email);
                console.log('Comment:', comment);

                // You can add further processing here, like sending the data to a server
            } else {
                console.error('One or more form elements not found!');
            }
        });
    } else {
        console.error('Comment form not found!');
    }
});
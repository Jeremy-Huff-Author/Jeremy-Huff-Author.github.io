document.addEventListener('DOMContentLoaded', function() {
    const mailingListForm = document.getElementById('mailingListForm'); // Assuming your form has this ID

    if (mailingListForm) {
        mailingListForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission

            const nameInput = document.getElementById('name'); // Assuming your name input has this ID
            const emailInput = document.getElementById('email'); // Assuming your email input has this ID

            if (nameInput && emailInput) {
                const name = nameInput.value;
                const email = emailInput.value;

                console.log('Name:', name);
                console.log('Email:', email);

                // Send the data to your Netlify function
                fetch('https://jeremythuff.netlify.app/.netlify/functions/mailing-list-handler', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name, email }),
                })
                .then(response => response.json())
                .then(data => console.log('Subscription response:', data))
                .then(() => {
                    // Close the modal
                    const commentModal = document.getElementById('mailing-list-modal');
                    const modal = bootstrap.Modal.getInstance(commentModal) || new bootstrap.Modal(commentModal);
                    if (modal) {
                        modal.hide();
                        mailingListForm.reset();
                    }
                })
                .catch((error) => console.error('Error:', error))

            } else {
                console.error('Name or Email input not found.');
            }
        });
    } else {
        console.error('Mailing list form not found.');
    }
});
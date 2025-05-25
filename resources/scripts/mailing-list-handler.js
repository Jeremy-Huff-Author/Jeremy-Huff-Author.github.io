document.addEventListener('DOMContentLoaded', function() {
    const mailingListForm = document.getElementById('mailing-list-form'); // Assuming your form has this ID

    if (mailingListForm) {
        mailingListForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent the default form submission
            // Disable form fields and buttons while processing
            mailingListForm.querySelectorAll('.form-control, .button').forEach(element => {
                element.disabled = true;
            });

            grecaptcha.ready(function() {
                grecaptcha.execute('6Lfr2EgrAAAAAEUh6j5JqZxhf8FqUiy2a--73wja', {action: 'submit'}).then(function(token) {
                    const nameInput = document.getElementById('nameInput'); // Assuming your name input has this ID
                    const emailInput = document.getElementById('emailInput'); // Assuming your email input has this ID

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
                            // Clear the form and close the modal
                            const mailingListModalElement = document.getElementById('mailingListModal');
                            const modal = bootstrap.Modal.getInstance(mailingListModalElement);
                            if (modal) {
                                modal.hide();
                                mailingListForm.reset();
                                mailingListForm.querySelectorAll('.form-control, .button').forEach(element => {
                                    element.disabled = false;
                                });
                            }
                        })
                        .catch((error) => console.error('Error:', error))

                    } else {
                        console.error('Name or Email input not found.');
                    }
                });
            });
        });
    } else {
        console.error('Mailing list form not found.');
    }
});
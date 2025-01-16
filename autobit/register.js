document.addEventListener('DOMContentLoaded', async () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        // Client-side validation
        if (password !== confirmPassword) {
            showMessage('Passwords do not match', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Error from server:', data.message);
                showMessage(data.message, 'error');
                return;
            }

            // Show success message with OK button
            showMessage(data.message, 'success', true);

        } catch (error) {
            console.error('Network or server error:', error);
            showMessage('Network or server error. Please try again later.', 'error');
        }
    });
});

/**
 * Displays a notification message on the screen.
 * @param {string} message - The message to display.
 * @param {string} type - The type of message: 'success' or 'error'.
 * @param {boolean} showOkButton - Whether to show the "OK" button for redirect.
 */
function showMessage(message, type, showOkButton = false) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = `notification ${type}`; // "success" or "error"
    
    // Create an "OK" button if showOkButton is true
    if (showOkButton) {
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.className = 'ok-button';
        okButton.addEventListener('click', () => {
            window.location.replace('login.html');  // Redirect to login page when OK is clicked
        });
        messageElement.appendChild(okButton);
    }

    document.body.appendChild(messageElement);

    // Automatically remove message after 3 seconds if no OK button
    if (!showOkButton) {
        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
}

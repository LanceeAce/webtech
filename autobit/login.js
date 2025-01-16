document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginButton = loginForm.querySelector('button[type="submit"]');

    let invalidPasswordShown = false;

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        // Clear previous error messages
        const errorMessagesContainer = document.getElementById('error-messages');
        errorMessagesContainer.innerHTML = '';

        if (username === '' || password === '') {
            showMessage('Please fill in both fields.', 'error');
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log('Server response:', data); // Log the full server response

            if (response.ok) {
                // Directly save username (no token involved)
                localStorage.setItem('username', username);
                console.log('Login successful, username saved:', username);
                showMessage(data.message || 'Login successful', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html'; // Redirect to user page
                }, 2000);
            } else {
                if (data.message && data.message.includes('Invalid credentials') && !invalidPasswordShown) {
                    showError('Invalid username or password. Please try again.', 'password-error');
                    invalidPasswordShown = true;
 //deleted
                    if (user.isDeleted) {
                        return res.status(400).json({ error: 'Your account was deleted by admin' });
                    }

                    setTimeout(() => {
                        invalidPasswordShown = false;
                    }, 3000);
                } else {
                    showMessage(data.message || 'Login failed. Please try again.', 'error');
                }
            }
        } catch (error) {
            console.error('Network or server error:', error);
            showMessage('Network or server error. Please try again later.', 'error');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Login';
        }
    });

    function showError(message, id) {
        const errorMessagesContainer = document.getElementById('error-messages');
        const errorElement = document.createElement('p');
        errorElement.textContent = message;
        errorElement.id = id;
        errorElement.style.color = '#ff6f61';
        errorElement.style.fontSize = '14px';
        errorElement.style.fontWeight = 'bold';
        errorMessagesContainer.appendChild(errorElement);
    }

    function showMessage(message, type) {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;

        if (type === 'error') {
            messageElement.style.color = '#ff6f61'; // Red for errors
        } else {
            messageElement.style.color = '#28a745'; // Green for success
        }
        messageElement.style.fontSize = '14px';
        messageElement.style.fontWeight = 'bold';

        const errorMessagesContainer = document.getElementById('error-messages');
        errorMessagesContainer.appendChild(messageElement);

        setTimeout(() => {
            messageElement.remove();
        }, 3000);
    }
});

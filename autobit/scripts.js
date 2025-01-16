document.addEventListener('DOMContentLoaded', () => {

    function DisabledBackButton() {
        window.history.forward();
    }
    DisabledBackButton();
    window.onload = DisabledBackButton;
    window.onpageshow = function(evt) { if (evt.persisted) DisabledBackButton }
    window.onunload = function() { void 0 }

    const cartCount = document.getElementById('cart-count');
    const usernameDisplay = document.getElementById('username-display');
    const logoutBtn = document.getElementById('logout-btn');
    const viewCartBtn = document.getElementById('view-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotal = document.getElementById('cart-total');

    let cartItems = [];
    let totalAmount = 0;

    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
    const username = localStorage.getItem('username');
    const isBlocked = localStorage.getItem('isBlocked') === 'true'; // Check if user is blocked

    if (username) {
        usernameDisplay.textContent = `Welcome, ${username}`;
        usernameDisplay.style.display = 'inline';
        logoutBtn.style.display = 'inline-block';

        // Disable add to cart if blocked
        if (isBlocked) {
            const addToCartButtons = document.querySelectorAll('.add-to-cart');
            addToCartButtons.forEach(button => {
                button.disabled = true; // Disable the button
                button.title = 'Your account is blocked, you cannot add items to the cart'; // Tooltip message
            });
        }

        // Load cart from localStorage for this user
        cartItems = JSON.parse(localStorage.getItem(`cartItems_${username}`)) || [];
        totalAmount = parseFloat(localStorage.getItem(`cartTotal_${username}`)) || 0;

        cartCount.textContent = cartItems.length;
        cartTotal.textContent = totalAmount.toFixed(2);
    } else {
        usernameDisplay.style.display = 'none';
        logoutBtn.style.display = 'none';
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            if (isBlocked) {
                alert('Your account is blocked. You cannot add items to the cart.');
                return;
            }

            const productElement = event.target.closest('.product');
            if (productElement) {
                const productName = productElement.getAttribute('data-name');
                const productPrice = parseFloat(productElement.getAttribute('data-price'));

                // Add item to cart
                cartItems.push({ name: productName, price: productPrice });
                totalAmount += productPrice;

                // Update cart count and total
                cartCount.textContent = cartItems.length;
                cartTotal.textContent = totalAmount.toFixed(2);

                // Save cart to localStorage with user-specific key
                localStorage.setItem(`cartItems_${username}`, JSON.stringify(cartItems));
                localStorage.setItem(`cartTotal_${username}`, totalAmount.toFixed(2));
            }
        });
    });

    // Show cart items in the modal
    viewCartBtn.addEventListener('click', () => {
        cartItemsList.innerHTML = '';
        cartItems.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${item.name} - ₱${item.price.toFixed(2)}
                <button class="remove-btn" data-index="${index}">Remove</button>`;
            cartItemsList.appendChild(li);
        });

        cartModal.style.display = 'block';
    });

    // Remove item from cart
    cartItemsList.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const index = event.target.getAttribute('data-index');
            const itemPrice = cartItems[index].price;

            // Remove item from cart array
            cartItems.splice(index, 1);
            totalAmount -= itemPrice;

            // Update cart count and total
            cartCount.textContent = cartItems.length;
            cartTotal.textContent = totalAmount.toFixed(2);

            // Save updated cart to localStorage with user-specific key
            localStorage.setItem(`cartItems_${username}`, JSON.stringify(cartItems));
            localStorage.setItem(`cartTotal_${username}`, totalAmount.toFixed(2));

            // Update cart modal display
            viewCartBtn.click(); // Re-trigger view cart to update list
        }
    });

    // Close cart modal
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });

    // Logout functionality
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedIn'); // Clear logged-in status
        localStorage.removeItem('username'); // Clear username
        localStorage.removeItem('isBlocked'); // Clear blocked status
        usernameDisplay.style.display = 'none';
        logoutBtn.style.display = 'none';
        window.location.href = 'login.html'; // Redirect to login page
    });

    // Search functionality
    document.getElementById('search-bar').addEventListener('input', function() {
        const searchValue = this.value.toLowerCase();
        const products = document.querySelectorAll('.product');
        let hasResults = false;

        products.forEach(product => {
            const productName = product.getAttribute('data-name').toLowerCase();
            product.style.display = productName.includes(searchValue) ? '' : 'none';
            if (product.style.display !== 'none') {
                hasResults = true;
            }
        });

        const noResultsMessage = document.getElementById('no-results-message');
        noResultsMessage.style.display = hasResults ? 'none' : 'block';
    });

    // Filter functionality with hiding other categories
    document.getElementById('category-filter').addEventListener('change', function() {
        const selectedCategory = this.value;
        const categories = document.querySelectorAll('.products h2');
        
        categories.forEach(category => {
            const categoryTitle = category.textContent;
            const shouldHide = selectedCategory && categoryTitle !== selectedCategory;
            category.style.display = shouldHide ? 'none' : '';

            // Show or hide products under the category
            let nextElement = category.nextElementSibling;
            while (nextElement && nextElement.classList.contains('product')) {
                nextElement.style.display = shouldHide ? 'none' : '';
                nextElement = nextElement.nextElementSibling;
            }
        });
    });

    const products = document.querySelectorAll('.product');
    products.forEach((product, index) => {
        product.style.setProperty('--i', index + 1);
    });
});

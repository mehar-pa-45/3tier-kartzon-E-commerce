document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('products-grid');
    const categoryFilters = document.getElementById('category-filters');

    
    // Cart Elements
    const cartIcon = document.getElementById('cart-icon');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalPrice = document.getElementById('cart-total-price');

    let allProducts = [];
    let cart = [];

    // Fetch products from API
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) throw new Error('Failed to fetch products');
            allProducts = await response.json();
            renderProducts(allProducts);
        } catch (error) {
            console.error('Error:', error);
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #ef4444;">Failed to load products. Make sure the backend is running and MongoDB is connected.</p>';
        }
    }

    // Render products
    function renderProducts(products) {
        productsGrid.innerHTML = '';
        if (products.length === 0) {
            productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No products found.</p>';
            return;
        }

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${product.imageUrl}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&auto=format&fit=crop'">
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-desc">${product.description}</p>
                    <div class="product-footer">
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <button class="add-to-cart" data-id="${product._id}" title="Add to Cart">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                    </div>
                </div>
            `;
            productsGrid.appendChild(card);
        });

        // Add event listeners to new buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.currentTarget.dataset.id;
                addToCart(id);
            });
        });
    }

    // Filter Products
    categoryFilters.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            // Update active state
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');

            const filter = e.target.dataset.filter;
            if (filter === 'all') {
                renderProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p => p.category === filter);
                renderProducts(filtered);
            }
        }
    });


    // --- Cart Logic ---

    function addToCart(productId) {
        const product = allProducts.find(p => p._id === productId);
        if (product) {
            cart.push(product);
            updateCartUI();
            
            // Small animation on cart icon
            cartIcon.style.transform = 'scale(1.2)';
            setTimeout(() => cartIcon.style.transform = 'scale(1)', 200);
            
            // Open sidebar
            openCart();
        }
    }

    function removeFromCart(index) {
        cart.splice(index, 1);
        updateCartUI();
    }

    function updateCartUI() {
        cartCount.textContent = cart.length;
        
        cartItemsContainer.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p style="color: var(--text-secondary); text-align: center; margin-top: 2rem;">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                total += item.price;
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.imageUrl}" alt="${item.name}" class="cart-item-img" onerror="this.src='https://images.unsplash.com/photo-1588508065123-287b28e013da?w=500&auto=format&fit=crop'">
                    <div class="cart-item-info">
                        <h4 class="cart-item-title">${item.name}</h4>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <button class="cart-item-remove" data-index="${index}">Remove</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;

        // Add remove listeners
        document.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                removeFromCart(e.target.dataset.index);
            });
        });
    }

    function openCart() {
        cartOverlay.classList.add('active');
        cartSidebar.classList.add('active');
    }

    function closeCart() {
        cartOverlay.classList.remove('active');
        cartSidebar.classList.remove('active');
    }

    cartIcon.addEventListener('click', openCart);
    closeCartBtn.addEventListener('click', closeCart);
    cartOverlay.addEventListener('click', closeCart);

    // --- Auth & Checkout Logic ---
    const authBtn = document.getElementById('auth-btn');
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.getElementById('close-auth');
    const authForm = document.getElementById('auth-form');
    const authSwitch = document.getElementById('auth-switch');
    const authTitle = document.getElementById('auth-title');
    const authEmail = document.getElementById('auth-email');
    const authPassword = document.getElementById('auth-password');
    const authMessage = document.getElementById('auth-message');
    
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutMessage = document.getElementById('checkout-message');

    let isLoginMode = true;

    // Check Auth State on Load
    function checkAuthState() {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('userEmail');
        const userGreeting = document.getElementById('user-greeting');
        
        if (token && email) {
            authBtn.textContent = 'Logout';
            const username = email.split('@')[0];
            userGreeting.textContent = `Hello, ${username}`;
            userGreeting.style.display = 'inline';
        } else {
            authBtn.textContent = 'Login';
            if(userGreeting) userGreeting.style.display = 'none';
        }
    }
    checkAuthState();

    // Header Auth Button Click
    authBtn.addEventListener('click', () => {
        if (localStorage.getItem('token')) {
            // Logout
            localStorage.removeItem('token');
            localStorage.removeItem('userEmail');
            checkAuthState();
            alert('Logged out successfully');
        } else {
            // Open Login Modal
            authModal.classList.add('active');
        }
    });

    closeAuthBtn.addEventListener('click', () => {
        authModal.classList.remove('active');
    });

    // Switch between Login and Register
    authSwitch.addEventListener('click', (e) => {
        if (e.target.tagName === 'SPAN') {
            isLoginMode = !isLoginMode;
            if (isLoginMode) {
                authTitle.textContent = 'Login';
                authSwitch.innerHTML = 'Need an account? <span>Register</span>';
            } else {
                authTitle.textContent = 'Register';
                authSwitch.innerHTML = 'Already have an account? <span>Login</span>';
            }
        }
    });

    // Handle Auth Form Submit
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const url = isLoginMode ? '/api/auth/login' : '/api/auth/register';
        const data = {
            email: authEmail.value,
            password: authPassword.value
        };

        const submitBtn = authForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;

        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.message || 'Authentication failed');

            localStorage.setItem('token', result.token);
            localStorage.setItem('userEmail', result.email);
            checkAuthState();
            
            authMessage.textContent = isLoginMode ? 'Logged in successfully!' : 'Registered successfully!';
            authMessage.className = 'form-message success';
            
            setTimeout(() => {
                authModal.classList.remove('active');
                authForm.reset();
                authMessage.textContent = '';
                authMessage.className = 'form-message';
                submitBtn.disabled = false;
            }, 1500);
            
        } catch (error) {
            authMessage.textContent = error.message;
            authMessage.className = 'form-message error';
            submitBtn.disabled = false;
        }
    });

    // Handle Checkout Click
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        if (!localStorage.getItem('token')) {
            // Close cart and open login
            closeCart();
            authModal.classList.add('active');
            alert('Please login to checkout.');
            return;
        }

        // Open Checkout Modal
        closeCart();
        checkoutModal.classList.add('active');
    });

    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    // Handle Checkout Form Submit (Mock Payment)
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) return;

        const orderData = {
            items: cart.map(item => ({
                product: item._id,
                name: item.name,
                price: item.price,
                quantity: 1
            })),
            totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
            shippingAddress: {
                fullName: document.getElementById('ship-name').value,
                address: document.getElementById('ship-address').value,
                city: document.getElementById('ship-city').value,
                zipCode: document.getElementById('ship-zip').value
            }
        };

        const submitBtn = checkoutForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Processing...';
        submitBtn.disabled = true;

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(orderData)
            });
            const result = await res.json();

            if (!res.ok) throw new Error(result.message || 'Order failed');

            checkoutMessage.textContent = 'Payment successful! Order placed.';
            checkoutMessage.className = 'form-message success';
            
            // Clear Cart
            cart = [];
            updateCartUI();

            setTimeout(() => {
                checkoutModal.classList.remove('active');
                checkoutForm.reset();
                checkoutMessage.textContent = '';
                checkoutMessage.className = 'form-message';
                submitBtn.textContent = 'Pay & Place Order';
                submitBtn.disabled = false;
            }, 2000);
            
        } catch (error) {
            checkoutMessage.textContent = error.message;
            checkoutMessage.className = 'form-message error';
            submitBtn.textContent = 'Pay & Place Order';
            submitBtn.disabled = false;
        }
    });

    // Initial fetch
    fetchProducts();
});

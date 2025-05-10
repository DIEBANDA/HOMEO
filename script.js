// DOM Elements
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const sidebar = document.querySelector('.sidebar');
const sidebarOverlay = document.querySelector('.sidebar-overlay');
const submenuItems = document.querySelectorAll('.submenu > a');
const cartCount = document.getElementById('cart-count');
const searchIcon = document.querySelector('.search-icon');
const searchBar = document.querySelector('.search-bar');
const input = document.querySelector('.search-bar input');
const sortSelect = document.getElementById('sort-by');
const categorySelect = document.getElementById('category-filter');

// Sample products data
const products = [
    {
        id: 1,
        name: "Silk Satin Pajama Set",
        price: 89.99,
        originalPrice: 109.99,
        category: "silk",
        image: "images/silk-pajama1.jpg",
    },
    {
        id: 2,
        name: "Cotton Floral Pajama Set",
        price: 49.99,
        originalPrice: 59.99,
        category: "cotton",
        image: "images/cotton-pajama1.jpg",
    },
    {
        id: 3,
        name: "Lace Trim Pajama Set",
        price: 65.99,
        category: "lace",
        image: "images/lace-pajama1.jpg",
    },
    {
        id: 4,
        name: "Winter Flannel Pajama Set",
        price: 79.99,
        originalPrice: 99.99,
        category: "cotton",
        image: "images/winter-pajama1.jpg",
    },
    {
        id: 5,
        name: "Premium Silk Robe",
        price: 99.99,
        category: "silk",
        image: "images/silk-robe1.jpg"
    },
    {
        id: 6,
        name: "Organic Cotton Sleep Shirt",
        price: 39.99,
        category: "cotton",
        image: "images/cotton-shirt1.jpg"
    }
];

//Create search results container
const searchResults = document.createElement('div');
searchResults.className = 'search-results';
document.querySelector('.search').appendChild(searchResults);

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('nav ul li a, .sidebar ul li a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');

    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));

                this.classList.add('active');

                const tabName = this.getAttribute('data-tab');
                document.getElementById(`${tabName}-form`).classList.add('active');
            });
        });
    }

    // ✅ تحديث زر "أضف إلى العربة" في صفحة التفاصيل
    const detailAddToCartBtn = document.querySelector('.product-detail-container .add-to-cart');
    const productIdFromURL = new URLSearchParams(window.location.search).get('id');

    if (detailAddToCartBtn) {
        // تأكيد ربط الحدث
        detailAddToCartBtn.addEventListener('click', addToCart);

        // ضبط data-id من رابط الصفحة
        if (productIdFromURL) {
            detailAddToCartBtn.setAttribute('data-id', productIdFromURL);
        }
    }

    updateCartCount();
    initEventListeners();
    loadProducts();
    highlightCurrentPage();
    setupQuantityControls();
    initCartPage();

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category && categorySelect) {
        categorySelect.value = category;
    }
});

// Initialize event listeners
function initEventListeners() {
    // Mobile menu toggle
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Close sidebar when clicking overlay
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileMenu);
    }
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
        searchInput.addEventListener('focus', showSearchResults);
    }
    
    if (searchBtn) {
        searchBtn.addEventListener('click', toggleSearch);
    }
    
    // Close search results when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search')) {
            searchResults.style.display = 'none';
        }
    });
    
    // Submenu toggle
    submenuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            this.parentElement.classList.toggle('active');
        });
    });
    
    // Sort and filter changes
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }
    
    if (categorySelect) {
        categorySelect.addEventListener('change', filterProducts);
    }

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            window.location.href = `products.html?category=${category}`;
        });
    });
}

// Toggle mobile menu
function toggleMobileMenu() {
    document.body.classList.toggle('sidebar-open');
    sidebar.classList.toggle('active');
    
    // Change icon to X when menu is open
    if (sidebar.classList.contains('active')) {
        mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
    } else {
        mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }
}

// Close mobile menu
function closeMobileMenu() {
    document.body.classList.remove('sidebar-open');
    sidebar.classList.remove('active');
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
}

// Update cart count
function updateCartCount() {
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Load products
function loadProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    const urlParams = new URLSearchParams(window.location.search);
    const selectedCategory = urlParams.get('category');

    let filteredProducts = products;
    if (selectedCategory && selectedCategory !== 'all') {
        filteredProducts = products.filter(product => product.category === selectedCategory);
    }

    displayProducts(filteredProducts);
}

// Display products in grid
function displayProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-id', product.id);

        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-title-price">
                    <h3 class="product-title">${product.name}</h3>
                    <span class="price">$${product.price.toFixed(2)}</span>
                </div>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });

    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const productId = this.getAttribute('data-id');
            if (productId) {
                window.location.href = `product-detail.html?id=${productId}`;
            }
        });
    });
}

// Filter and sort products
function filterProducts() {
    const sortValue = sortSelect.value;
    const categoryValue = categorySelect.value;

    let filteredProducts = [...products];

    if (categoryValue !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryValue);
    }

    switch (sortValue) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name-desc':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
    }

    displayProducts(filteredProducts);
}

// Add to cart function
function addToCart(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const productId = parseInt(this.getAttribute('data-id'));
    const quantity = parseInt(document.getElementById('quantity')?.value) || 1;
    const selectedSize = document.querySelector('input[name="size"]:checked')?.value || 'M';
    const selectedColor = document.querySelector('input[name="color"]:checked')?.value || 'Default';
    
    if (!productId && window.location.pathname.includes("product-detail.html")) {
        const urlParams = new URLSearchParams(window.location.search);
        productId = parseInt(urlParams.get('id'));
    }

    // Get product details
    const product = {
        id: productId,
        name: this.closest('.product-card')?.querySelector('.product-title')?.textContent || 
             document.getElementById('product-name')?.textContent,
        price: parseFloat(this.closest('.product-price')?.querySelector('.price')?.textContent.replace('$', '') || 
              document.getElementById('product-price')?.textContent.replace('$', '')),
        image: this.closest('.product-card')?.querySelector('img')?.src || 
               document.getElementById('main-product-image')?.src
    };
    
    // Get or initialize cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if product already in cart
    const existingItemIndex = cart.findIndex(item => 
        item.id === productId && 
        item.size === selectedSize && 
        item.color === selectedColor
    );
    
    if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({
            ...product,
            quantity: quantity,
            size: selectedSize,
            color: selectedColor
        });
    }

    if (window.location.pathname.includes('cart.html')) {
        displayCartItems();
    }
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Change button style temporarily
    const button = this;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.backgroundColor = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-shopping-cart"></i> Add to Cart';
        button.style.backgroundColor = 'var(--secondary-color)';
    }, 2000);
    
    // Pulse animation for cart count
    if (cartCount) {
        cartCount.style.transform = 'scale(1.5)';
        setTimeout(() => {
            cartCount.style.transform = 'scale(1)';
        }, 300);
    }
}

// Quantity controls functionality
function setupQuantityControls() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.querySelector('.quantity-minus');
    const plusBtn = document.querySelector('.quantity-plus');

    if (minusBtn && plusBtn && quantityInput) {
        minusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });

        plusBtn.addEventListener('click', (e) => {
            e.preventDefault();
            let currentValue = parseInt(quantityInput.value);
            quantityInput.value = currentValue + 1;
        });
    }
}

// Display cart items
function displayCartItems() {
    const cartItemsList = document.getElementById('cart-items-list');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart.length === 0) {
        showEmptyCartMessage();
        updateCartSummary(0);
        return;
    }
    
    cartItemsList.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.dataset.index = index;
        cartItem.innerHTML = `
            <div class="cart-item-product">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <div class="item-options">
                        <span class="badge-size">Size: ${item.size}</span>
                        <span class="color-circle" style="background-color: ${item.color};"></span>
                    </div>
                </div>
            </div>
            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            <div class="cart-item-quantity">
                <input type="number" value="${item.quantity}" min="1" 
                       data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
            </div>
            <div class="cart-item-total">$${itemTotal.toFixed(2)}</div>
            <div class="cart-item-remove" 
                 data-id="${item.id}" data-size="${item.size}" data-color="${item.color}">
                <i class="fas fa-trash"></i>
            </div>
        `;
        cartItemsList.appendChild(cartItem);
    });
    
    updateCartSummary(subtotal);
    setupCartItemEvents();
}

function updateCartSummary(subtotal) {
    const tax = subtotal * 0.1; // 10% tax for example
    const shipping = subtotal > 0 ? 5.00 : 0;
    const total = subtotal + tax + shipping;
    
    document.getElementById('cart-subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('cart-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('cart-shipping').textContent = `$${shipping.toFixed(2)}`;
}

// Setup events for cart items
function setupCartItemEvents() {
    // Quantity change
    document.querySelectorAll('.cart-item-quantity input').forEach(input => {
        input.addEventListener('change', function() {
            const id = parseInt(this.getAttribute('data-id'));
            const size = this.getAttribute('data-size');
            const color = this.getAttribute('data-color');
            const newQuantity = parseInt(this.value);
            
            updateCartItemQuantity(id, size, color, newQuantity);
        });
    });
    
    // Remove item
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const id = parseInt(this.getAttribute('data-id'));
            const size = this.getAttribute('data-size');
            const color = this.getAttribute('data-color');
            
            removeCartItem(id, size, color);
        });
    });
}

function updateCartItemQuantity(id, size, color, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const itemIndex = cart.findIndex(item => 
        item.id === id && 
        item.size === size && 
        item.color === color
    );
    
    if (itemIndex >= 0 && newQuantity > 0) {
        cart[itemIndex].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
        updateCartCount();
    } else if (newQuantity <= 0) {
        // إذا كانت الكمية أقل من أو تساوي صفر، احذف العنصر
        removeCartItem(id, size, color);
    }
}

function removeCartItem(id, size, color) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => 
        !(item.id === id && 
        item.size === size && 
        item.color === color)
    );
    
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartCount();
    
    // إظهار رسالة تأكيد
    if (cart.length === 0) {
        showEmptyCartMessage();
    } else {
        showToast('تم حذف المنتج من السلة');
    }
}

function showEmptyCartMessage() {
    const cartItemsList = document.getElementById('cart-items-list');
    cartItemsList.innerHTML = `
        <div class="empty-cart-message">
            <p>Your cart is currently empty.</p>
            <a href="products.html" class="btn">Continue Shopping</a>
        </div>
    `;
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize cart page
function initCartPage() {
    if (document.getElementById('cart-items-list')) {
        // تحميل السلة من localStorage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        
        // إذا كانت السلة فارغة، عرض رسالة السلة الفارغة
        if (cart.length === 0) {
            showEmptyCartMessage();
            updateCartSummary(0);
        } else {
            // إذا كانت تحتوي على عناصر، عرضها
            displayCartItems();
        }
    }
}

function clearCart() {
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    
    if (window.location.pathname.includes('cart.html')) {
        showEmptyCartMessage();
        updateCartSummary(0);
    }
}

// يمكنك استدعاؤها عند الحاجة، مثلاً عند النقر على زر "تفريغ السلة"
document.querySelector('.clear-cart-btn')?.addEventListener('click', clearCart);

// Handle search input
function handleSearchInput(e) {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
        searchResults.style.display = 'none';
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query)
    );
    
    displaySearchResults(filteredProducts);
}

// Display search results
function displaySearchResults(results) {
    searchResults.innerHTML = '';
    
    if (results.length === 0) {
        searchResults.innerHTML = '<div class="no-results">No products found</div>';
        searchResults.style.display = 'block';
        return;
    }
    
    results.forEach(product => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <div class="search-result-info">
                <h4>${product.name}</h4>
                <p>$${product.price.toFixed(2)}</p>
            </div>
        `;
        
        resultItem.addEventListener('click', () => {
            window.location.href = `product-detail.html?id=${product.id}`;
        });
        
        searchResults.appendChild(resultItem);
    });
    
    searchResults.style.display = 'block';
}

// Show search results
function showSearchResults() {
    if (searchInput.value.trim().length > 0) {
        searchResults.style.display = 'block';
    }
}

// Toggle search bar
function toggleSearch(e) {
    e.stopPropagation();
    document.querySelector('.search').classList.toggle('active');
    
    if (document.querySelector('.search').classList.contains('active')) {
        searchInput.focus();
    } else {
        searchInput.value = '';
        searchResults.style.display = 'none';
    }
}

function toggleMobileSearch() {
    const searchContainer = document.getElementById('mobileSearch');
    searchContainer.classList.toggle('active');
}

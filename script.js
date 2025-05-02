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
document.addEventListener('DOMContentLoaded', function() {
    const authTabs = document.querySelectorAll('.auth-tab');
    const authForms = document.querySelectorAll('.auth-form');
    
    if (authTabs.length > 0) {
        authTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                // Remove active class from all tabs and forms
                authTabs.forEach(t => t.classList.remove('active'));
                authForms.forEach(f => f.classList.remove('active'));
                
                // Add active class to clicked tab
                this.classList.add('active');
                
                // Show corresponding form
                const tabName = this.getAttribute('data-tab');
                document.getElementById(`${tabName}-form`).classList.add('active');
            });
        });
    }
    updateCartCount();
    initEventListeners();
    loadProducts();
    highlightCurrentPage();
    setupQuantityControls();
    initCartPage();
    
    // Set category filter from URL if exists
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
    
    // Search icon click
    if (searchIcon) {
        searchIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // إغلاق القائمة الجانبية إذا كانت مفتوحة
            if (sidebar.classList.contains('active')) {
                closeMobileMenu();
            }
            
            // تبديل حالة شريط البحث
            searchBar.classList.toggle('active');
            
            // التركيز على حقل الإدخال إذا ظهر الشريط
            if (searchBar.classList.contains('active')) {
                input.focus();
            } else {
                // إخفاء نتائج البحث إذا اختفى الشريط
                const searchResults = document.querySelector('.search-results');
                if (searchResults) {
                    searchResults.style.display = 'none';
                }
            }
        });
    }
    
    // إغلاق شريط البحث عند النقر في أي مكان آخر
    document.addEventListener('click', function(e) {
        if (!searchBar.contains(e.target) && e.target !== searchIcon) {
            searchBar.classList.remove('active');
            const searchResults = document.querySelector('.search-results');
            if (searchResults) {
                searchResults.style.display = 'none';
            }
        }
    });
    
    // Initialize search functionality
    initSearch();
    
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

// Toggle search bar with animation
function toggleSearchBar(e) {
    e.stopPropagation();
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        searchBar.querySelector('input').focus();
    }
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
    
    if (!localStorage.getItem('cart')) {
        localStorage.setItem('cart', JSON.stringify([]));
    }

    // Sample products data (would normally come from API)
    const products = [
        {
            id: 1,
            name: "Silk Satin Pajama Set",
            price: 89.99,
            originalPrice: 109.99,
            category: "silk",
            image: "images/silk-pajama1.jpg",
            badge: "Bestseller"
        },
        {
            id: 2,
            name: "Cotton Floral Pajama Set",
            price: 49.99,
            originalPrice: 59.99,
            category: "cotton",
            image: "images/cotton-pajama1.jpg",
            badge: "Sale"
        },
        {
            id: 3,
            name: "Lace Trim Pajama Set",
            price: 65.99,
            category: "lace",
            image: "images/lace-pajama1.jpg",
            badge: "New"
        },
        {
            id: 4,
            name: "Winter Flannel Pajama Set",
            price: 79.99,
            originalPrice: 99.99,
            category: "cotton",
            image: "images/winter-pajama1.jpg",
            badge: "Limited"
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
    
    displayProducts(products);
}

// Display products in grid
function displayProducts(products) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">
                    <div>
                        ${product.originalPrice ? `<span class="old-price">$${product.originalPrice.toFixed(2)}</span>` : ''}
                        <span class="price">$${product.price.toFixed(2)}</span>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Add event listeners to new add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
    
    // Add click event to product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('add-to-cart')) {
                const productId = this.querySelector('.add-to-cart')?.getAttribute('data-id');
                if (productId) {
                    window.location.href = `product-detail.html?id=${productId}`;
                }
            }
        });
    });
}

// Filter and sort products
function filterProducts() {
    const sortValue = sortSelect.value;
    const categoryValue = categorySelect.value;
    
    // Get all products (in a real app, this would come from your data)
    const products = [
        {
            id: 1,
            name: "Silk Satin Pajama Set",
            price: 89.99,
            originalPrice: 109.99,
            category: "silk",
            image: "images/silk-pajama1.jpg",
            badge: "Bestseller"
        },
        {
            id: 2,
            name: "Cotton Floral Pajama Set",
            price: 49.99,
            originalPrice: 59.99,
            category: "cotton",
            image: "images/cotton-pajama1.jpg",
            badge: "Sale"
        },
        {
            id: 3,
            name: "Lace Trim Pajama Set",
            price: 65.99,
            category: "lace",
            image: "images/lace-pajama1.jpg",
            badge: "New"
        },
        {
            id: 4,
            name: "Winter Flannel Pajama Set",
            price: 79.99,
            originalPrice: 99.99,
            category: "cotton",
            image: "images/winter-pajama1.jpg",
            badge: "Limited"
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
    
    let filteredProducts = [...products];
    
    // Filter by category
    if (categoryValue !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === categoryValue);
    }
    
    // Sort products
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
        default:
            // Default sorting (by ID or as they come from API)
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
                        <span>Size: ${item.size}</span>
                        <span>Color: ${item.color}</span>
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

// Search functionality with suggestions
function initSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchResults = document.createElement('div');
    searchResults.className = 'search-results';
    searchBar.appendChild(searchResults);

    // عرض الاقتراحات عند التركيز على حقل البحث
    searchInput.addEventListener('focus', function() {
        showDefaultSuggestions();
    });

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();
        
        if (searchTerm.length === 0) {
            showDefaultSuggestions();
            return;
        }

        filterAndDisplayResults(searchTerm);
    });

    // إغلاق النتائج عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!searchBar.contains(e.target) && e.target !== searchIcon) {
            searchResults.style.display = 'none';
            if (window.innerWidth <= 768) {
                searchBar.classList.remove('active');
            }
        }
    });

    // عرض الاقتراحات الافتراضية
    function showDefaultSuggestions() {
        const products = getSampleProducts();
        displaySearchResults(products.slice(0, 5)); // عرض أول 5 منتجات كاقتراحات
    }

    // تصفية المنتجات حسب البحث
    function filterAndDisplayResults(searchTerm) {
        const products = getSampleProducts();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm)
        );
        
        if (filteredProducts.length > 0) {
            displaySearchResults(filteredProducts);
        } else {
            searchResults.innerHTML = '<div class="no-results">No products found</div>';
            searchResults.style.display = 'block';
        }
    }

    // عرض نتائج البحث
    function displaySearchResults(products) {
        searchResults.innerHTML = '';
        
        products.forEach(product => {
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

    // الحصول على المنتجات العينة
    function getSampleProducts() {
        return [
            {
                id: 1,
                name: "Silk Satin Pajama Set",
                price: 89.99,
                image: "images/silk-pajama1.jpg"
            },
            {
                id: 2,
                name: "Cotton Floral Pajama Set",
                price: 49.99,
                image: "images/cotton-pajama1.jpg"
            },
            {
                id: 3,
                name: "Lace Trim Pajama Set",
                price: 65.99,
                image: "images/lace-pajama1.jpg"
            },
            {
                id: 4,
                name: "Winter Flannel Pajama Set",
                price: 79.99,
                image: "images/winter-pajama1.jpg"
            },
            {
                id: 5,
                name: "Premium Silk Robe",
                price: 99.99,
                image: "images/silk-robe1.jpg"
            },
            {
                id: 6,
                name: "Organic Cotton Sleep Shirt",
                price: 39.99,
                image: "images/cotton-shirt1.jpg"
            }
        ];
    }
}
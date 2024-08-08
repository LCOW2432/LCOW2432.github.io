document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Function to load products from the JSON file
    function loadProducts() {
        if (productList) {
            fetch('data/products.json')
                .then(response => response.json())
                .then(products => {
                    products.forEach(product => {
                        const productItem = document.createElement('div');
                        productItem.classList.add('product-item');
                        productItem.innerHTML = `
                            <img src="${product.image}" alt="${product.name}">
                            <h3>${product.name}</h3>
                            <p>$${product.price.toFixed(2)}</p>
                            <button onclick="addToCart(${product.id})">Add to Cart</button>
                        `;
                        productList.appendChild(productItem);
                    });
                });
        }
    }

    // Function to add a product to the cart
    window.addToCart = function(productId) {
        fetch('data/products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === productId);
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
    }

    // Function to update the cart display
    function updateCart() {
        if (cartItems && cartTotal) {
            cartItems.innerHTML = '';
            let total = 0;

            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('cart-item');
                cartItem.innerHTML = `
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)}</p>
                    <button onclick="removeFromCart(${cart.indexOf(item)})">Remove</button>
                `;
                cartItems.appendChild(cartItem);
                total += item.price;
            });

            cartTotal.innerHTML = `<h3>Total: $${total.toFixed(2)}</h3>`;
        }
    }

    // Function to remove a product from the cart
    window.removeFromCart = function(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCart();
    }

    // Function to handle the checkout process
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length > 0) {
                alert(`Thank you for your purchase! Your total is $${calculateTotal().toFixed(2)}.`);
                cart = [];
                localStorage.removeItem('cart');
                updateCart();
            } else {
                alert('Your cart is empty.');
            }
        });
    }

    // Helper function to calculate the total price of the cart
    function calculateTotal() {
        return cart.reduce((total, item) => total + item.price, 0);
    }

    loadProducts();
    updateCart();
});

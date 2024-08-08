document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartTax = document.getElementById('cart-tax');
    const cartTotalWithTax = document.getElementById('cart-total-with-tax');
    const checkoutBtn = document.getElementById('checkout-btn');

    const TAX_RATE = 0.10; // 10% tax rate
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
        if (cartItems && cartTotal && cartTax && cartTotalWithTax) {
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

            const tax = total * TAX_RATE;
            const totalWithTax = total + tax;

            cartTotal.innerHTML = `<h3>Subtotal: $${total.toFixed(2)}</h3>`;
            cartTax.innerHTML = `<h3>Tax (10%): $${tax.toFixed(2)}</h3>`;
            cartTotalWithTax.innerHTML = `<h3>Total: $${totalWithTax.toFixed(2)}</h3>`;
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
                const totalWithTax = calculateTotalWithTax();
                alert(`Thank you for your purchase! Your total is $${totalWithTax.toFixed(2)}.`);
                cart = [];
                localStorage.removeItem('cart');
                updateCart();
            } else {
                alert('Your cart is empty.');
            }
        });
    }

    // Helper function to calculate the total price of the cart including tax
    function calculateTotalWithTax() {
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        const tax = total * TAX_RATE;
        return total + tax;
    }

    loadProducts();
    updateCart();
});

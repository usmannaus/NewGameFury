document.addEventListener('DOMContentLoaded', () => {
    const quantityInputs = document.querySelectorAll('.quantity-input');
    const orderTableBody = document.querySelector('#order-table tbody');
    const totalPriceElement = document.getElementById('total-price');
    const addFavouritesBtn = document.getElementById('add-favourites');
    const applyFavouritesBtn = document.getElementById('apply-favourites');
    const buyNowBtn = document.getElementById('buy-now');

    function updateOrderSummary() {
        orderTableBody.innerHTML = '';
        let total = 0;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                const productCard = input.closest('.product-card');
                const name = productCard.getAttribute('data-name');
                const price = parseInt(productCard.getAttribute('data-price'));
                const subtotal = price * quantity;
                total += subtotal;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${name}</td>
                    <td>${price.toLocaleString()}</td>
                    <td>${quantity}</td>
                    <td>${subtotal.toLocaleString()}</td>
                `;
                orderTableBody.appendChild(row);
            }
        });

        totalPriceElement.textContent = total.toLocaleString();
    }

    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.value < 0) input.value = 0;
            updateOrderSummary();
        });
    });

    addFavouritesBtn.addEventListener('click', () => {
        const favourites = {};
        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                const productCard = input.closest('.product-card');
                const name = productCard.getAttribute('data-name');
                favourites[name] = quantity;
            }
        });
        localStorage.setItem('favourites', JSON.stringify(favourites));
        alert('Added to favourites!');
    });

    applyFavouritesBtn.addEventListener('click', () => {
        const favourites = JSON.parse(localStorage.getItem('favourites'));
        if (favourites) {
            quantityInputs.forEach(input => {
                const productCard = input.closest('.product-card');
                const name = productCard.getAttribute('data-name');
                if (favourites[name]) {
                    input.value = favourites[name];
                } else {
                    input.value = 0;
                }
            });
            updateOrderSummary();
            alert('Favourites applied!');
        } else {
            alert('No favourites found.');
        }
    });

    buyNowBtn.addEventListener('click', () => {
        // Gather all selected products and quantities
        const orderItems = [];
        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value);
            if (quantity > 0) {
                const productCard = input.closest('.product-card');
                const name = productCard.getAttribute('data-name');
                const price = parseInt(productCard.getAttribute('data-price'));
                orderItems.push({ name, price, quantity });
            }
        });
        if (orderItems.length === 0) {
            alert('Please select at least one item to buy.');
            return;
        }
        // Store the full order in sessionStorage
        const order = { items: orderItems };
        sessionStorage.setItem('order', JSON.stringify(order));
        // Navigate to order page
        window.location.href = 'payment.html';
    });

    // Remove event listeners on product Buy Now buttons by not adding them
    // (No code for productBuyNowButtons event listeners)

    // Initialize order summary on page load
    updateOrderSummary();
});

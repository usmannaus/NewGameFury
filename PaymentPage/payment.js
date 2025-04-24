document.addEventListener('DOMContentLoaded', () => {
    const order = JSON.parse(sessionStorage.getItem('order'));
    const orderSummaryTableBody = document.querySelector('#order-summary-table tbody');
    const orderTotalPriceElement = document.getElementById('order-total-price');
    const orderForm = document.getElementById('order-form');
    const thankYouMessage = document.getElementById('thank-you-message');

    function displayOrderSummary() {
        if (!order || !order.items || order.items.length === 0) {
            orderSummaryTableBody.innerHTML = '<tr><td colspan="4">No items in order.</td></tr>';
            orderTotalPriceElement.textContent = '0';
            return;
        }
        orderSummaryTableBody.innerHTML = '';
        let total = 0;
        order.items.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.price.toLocaleString()}</td>
                <td>${item.quantity}</td>
                <td>${subtotal.toLocaleString()}</td>
            `;
            orderSummaryTableBody.appendChild(row);
        });
        orderTotalPriceElement.textContent = total.toLocaleString();
    }

    function validateForm() {
        return orderForm.checkValidity();
    }

    function getExpectedDeliveryDate() {
        const today = new Date();
        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + 7); // 7 days from today
        return deliveryDate.toLocaleDateString();
    }

    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!validateForm()) {
            orderForm.reportValidity();
            return;
        }
        // Show thank you message with expected delivery date
        const deliveryDate = getExpectedDeliveryDate();
        thankYouMessage.textContent = `Thank you for your purchase! Your order is expected to be delivered by ${deliveryDate}.`;
        thankYouMessage.style.display = 'block';
        orderForm.style.display = 'none';
        // Clear order from sessionStorage
        sessionStorage.removeItem('order');
    });

    displayOrderSummary();
});

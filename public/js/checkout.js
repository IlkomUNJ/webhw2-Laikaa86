document.addEventListener('DOMContentLoaded', () => {
  loadOrderSummary();
  setupPaymentMethodHighlight();
  setupForm();
});

function loadOrderSummary() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const orderItems = document.getElementById('order-items');
  
  if (cart.length === 0) {
    orderItems.innerHTML = '<p class="empty-order">No items in cart</p>';
    updateTotals(0);
    return;
  }
  
  orderItems.innerHTML = cart.map(item => `
    <div class="order-item">
      <img src="${item.imgUrl}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="price">$${item.price.toLocaleString()}</p>
      </div>
    </div>
  `).join('');
  
  updateTotals(cart);
}

function updateTotals(cart) {
  const subtotal = Array.isArray(cart) 
    ? cart.reduce((sum, item) => sum + item.price, 0)
    : 0;
    
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('tax').textContent = `$${tax.toLocaleString()}`;
  document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

function setupPaymentMethodHighlight() {
  const paymentOptions = document.querySelectorAll('.payment-option input');
  
  paymentOptions.forEach(option => {
    option.addEventListener('change', (e) => {
      document.querySelectorAll('.payment-option').forEach(opt => {
        opt.classList.remove('selected');
      });
      e.target.closest('.payment-option').classList.add('selected');
    });
  });
}

function setupForm() {
  const form = document.getElementById('payment-form');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      address: document.getElementById('address').value,
      paymentMethod: document.querySelector('input[name="payment"]:checked').value
    };
    
    // Simulate order processing
    showConfirmation(formData);
  });
}

function showConfirmation(formData) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const total = cart.reduce((sum, item) => sum + item.price, 0) * 1.1; // Including tax
  
  const message = `
    Order Confirmation
    -----------------
    Total Amount: $${total.toLocaleString()}
    Payment Method: ${formData.paymentMethod}
    
    A confirmation email has been sent to ${formData.email}
    
    Thank you for your purchase!
  `;
  
  alert(message);
  
  // Clear cart and redirect to home
  localStorage.removeItem('cart');
  window.location.href = '/home';
}
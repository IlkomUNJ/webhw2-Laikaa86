document.addEventListener('DOMContentLoaded', () => {
  loadCart();
});

function loadCart() {
  const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
  const cartContainer = document.getElementById('cart-items');
  
  if (cartItems.length === 0) {
    cartContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    updateTotals(0);
    return;
  }
  
  cartContainer.innerHTML = cartItems.map((item, index) => `
    <div class="cart-item">
      <img src="${item.imgUrl}" alt="${item.name}">
      <div class="item-details">
        <h3>${item.name}</h3>
        <p class="price">$${item.price.toLocaleString()}</p>
        ${item.config ? `
          <div class="config-details">
            <p>Color: ${item.config.color}</p>
            <p>Interior: ${item.config.interior}</p>
            <p>Packages: ${item.config.packages.join(', ') || 'None'}</p>
          </div>
        ` : ''}
      </div>
      <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
    </div>
  `).join('');
  
  updateTotals(cartItems);
}

function removeFromCart(index) {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  
  // Show removal notification
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = 'Item removed from cart';
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

function updateTotals(cartItems) {
  const subtotal = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + item.price, 0)
    : 0;
    
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  
  document.getElementById('subtotal').textContent = `$${subtotal.toLocaleString()}`;
  document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}
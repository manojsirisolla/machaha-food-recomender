import React, { useState } from 'react'
import './Cart.css'
import { useCart } from '../../Context/CartContext'
import { useNotification } from '../../Context/NotificationContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
  const { cartItems, clearCart, incrementItem, decrementItem, removeItem } = useCart()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)


  const calculateTotals = () => {
    const subtotal = cartItems.reduce((total, item) => total + (parseFloat(item.price || 0) * item.quantity), 0)
    const deliveryFee = subtotal <= 50 ? 40 : 30
    const platformFee = 10
    const discount = subtotal > 300 ? 20 : 10
    const total = subtotal + deliveryFee + platformFee - discount
    return {
      subtotal: subtotal.toFixed(2),
      deliveryFee: deliveryFee.toFixed(2),
      platformFee: platformFee.toFixed(2),
      discount: discount.toFixed(2),
      total: total.toFixed(2)
    }
  }

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      showNotification('❌ Your cart is empty!', 3000)
      return
    }
    navigate('/checkout')
  }



  const totals = calculateTotals()

  return (
    <div className="cart-page">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="empty-cart">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {cartItems.map((it, idx) => (
              <div className="cart-item" key={it.id}>
                <img src={it.image} alt={it.name} className="cart-item-img" />
                <div className="cart-item-info">
                  <p className="cart-item-name">{it.name}</p>
                  <p className="cart-item-quantity-display">Quantity: {it.quantity}</p>
                  <p className="cart-item-price">₹{(parseFloat(it.price || 0) * it.quantity).toFixed(2)}</p>
                </div>
                <button className="remove-btn" onClick={() => removeItem(it.id)}>Remove</button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Items:</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{totals.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{totals.deliveryFee}</span>
            </div>
            <div className="summary-row">
              <span>Platform Fee:</span>
              <span>₹{totals.platformFee}</span>
            </div>
            <div className="summary-row">
              <span>Discount:</span>
              <span>-₹{totals.discount}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{totals.total}</span>
            </div>
          </div>

          <div className="cart-actions">
            <button className="clear-cart" onClick={clearCart}>
              Clear Cart
            </button>
            <button
              className="buy-now-btn"
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder}
            >
              {isPlacingOrder ? 'Processing...' : 'Buy Now'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart

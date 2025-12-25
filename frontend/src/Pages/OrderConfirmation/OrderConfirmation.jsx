 import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import './OrderConfirmation.css'

const OrderConfirmation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [orderData, setOrderData] = useState(null)
  const [orderStatus, setOrderStatus] = useState('confirmed')

  useEffect(() => {
    // Get order data from navigation state
    if (location.state?.order) {
      setOrderData(location.state.order)
    } else {
      // If no order data, redirect to home
      navigate('/')
    }
  }, [location.state, navigate])

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return '#4CAF50'
      case 'preparing': return '#FF9800'
      case 'out-for-delivery': return '#2196F3'
      case 'delivered': return '#4CAF50'
      default: return '#666'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return '✅'
      case 'preparing': return '👨‍🍳'
      case 'out-for-delivery': return '🚚'
      case 'delivered': return '📦'
      default: return '⏳'
    }
  }

  if (!orderData) {
    return <div className="loading">Loading order details...</div>
  }

  return (
    <div className="order-confirmation-page">
      <div className="confirmation-container">
        <div className="confirmation-header">
          <div className="success-icon">🎉</div>
          <h1>Order Confirmed!</h1>
          <p className="order-id">Order ID: #{orderData._id?.slice(-8) || 'ORD' + Date.now()}</p>
        </div>

        <div className="order-status">
          <h3>Order Status</h3>
          <div className="status-timeline">
            <div className="status-item active">
              <div className="status-icon">✅</div>
              <div className="status-content">
                <h4>Order Confirmed</h4>
                <p>Your order has been confirmed and is being prepared</p>
                <span className="status-time">{new Date().toLocaleString()}</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">👨‍🍳</div>
              <div className="status-content">
                <h4>Preparing</h4>
                <p>Our chefs are preparing your delicious food</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">🚚</div>
              <div className="status-content">
                <h4>Out for Delivery</h4>
                <p>Your order is on the way to your doorstep</p>
              </div>
            </div>
            <div className="status-item">
              <div className="status-icon">📦</div>
              <div className="status-content">
                <h4>Delivered</h4>
                <p>Enjoy your meal! Rate your experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-details">
          <h3>Order Details</h3>
          <div className="order-items">
            {orderData.items?.map((item, index) => (
              <div key={index} className="order-item">
                <img src={item.image} alt={item.name} className="item-image" />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p className="item-price">₹{item.price}</p>
                  <p className="item-quantity">Quantity: {item.quantity || 1}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>₹{orderData.subtotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee:</span>
              <span>₹{orderData.deliveryFee}</span>
            </div>
            <div className="summary-row">
              <span>Tax:</span>
              <span>₹{orderData.tax}</span>
            </div>
            <div className="summary-row total">
              <span>Total:</span>
              <span>₹{orderData.total}</span>
            </div>
          </div>
        </div>

        <div className="delivery-info">
          <h3>Delivery Information</h3>
          <div className="info-section">
            <div className="info-item">
              <h4>Delivery Address</h4>
              <p>{orderData.address?.name}</p>
              <p>{orderData.address?.street}</p>
              <p>{orderData.address?.city}, {orderData.address?.state} {orderData.address?.zipCode}</p>
              <p>📞 {orderData.address?.phone}</p>
            </div>
            <div className="info-item">
              <h4>Payment Method</h4>
              <p>{orderData.paymentMethod === 'cash' ? '💵 Cash on Delivery' :
                   orderData.paymentMethod === 'card' ? '💳 Credit/Debit Card' :
                   '📱 UPI'}</p>
            </div>
          </div>
        </div>



        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate('/')}>
            Continue Shopping
          </button>
          <button className="btn-secondary" onClick={() => navigate('/favorites')}>
            View Favorites
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation

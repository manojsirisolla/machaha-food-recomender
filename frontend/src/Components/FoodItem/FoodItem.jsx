import React from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { useCart } from '../../Context/CartContext'
import { useNotification } from '../../Context/NotificationContext'
import { useNavigate } from 'react-router-dom'

const FoodItem = ({ id, name, price, description, image, onSelectAndRemove, category, onViewDetails }) => {
  const { addToCart, cartItems, incrementItem, decrementItem, addToFavorites, favorites } = useCart()
  const { showNotification } = useNotification()
  const navigate = useNavigate()

  // deterministic rating selection based on id so items have varied ratings
  const computeRating = (id) => {
    const buckets = [3.0, 3.5, 4.0, 4.5, 5.0]
    let s = 0
    for (let i = 0; i < id.length; i++) s += id.charCodeAt(i)
    return buckets[s % buckets.length]
  }

  const rating = computeRating(String(id || '0'))

  const renderStars = (r) => {
    const full = Math.floor(r)
    const half = r % 1 === 0.5
    let out = '★'.repeat(full)
    if (half) out += '½'
    out += '☆'.repeat(5 - full - (half ? 1 : 0))
    return out
  }

  const itemCount = cartItems.find(item => item.id === id)?.quantity || 0

  const handleIncrement = () => {
    if (itemCount === 0) {
      addToCart({ id, name, price, description, image })
      showNotification(`✓ ${name} added to cart`)
    } else {
      incrementItem(id)
      showNotification(`✓ ${name} quantity increased`)
    }
  }

  const handleDecrement = () => {
    decrementItem(id)
    showNotification(`✓ ${name} removed from cart`)
  }

  const handleAddToCart = () => {
    const item = { id, name, price, description, image }
    addToCart(item)
    const newItemCount = cartItems.length + 1
    showNotification(`✓ ${newItemCount} item${newItemCount > 1 ? 's' : ''} added to cart`)
    // remove this item from the display list (parent manages items)
    if (typeof onSelectAndRemove === 'function') onSelectAndRemove(id)
    // stay on the same page after adding (no navigation)
  }

  const handleAddToFavorites = () => {
    const item = { id, name, price, description, image }
    addToFavorites(item)
    const isAlreadyFavorite = favorites.some(fav => fav.id === id)
    if (!isAlreadyFavorite) {
      showNotification(`✓ ${name} added to favorites`)
    }
  }

  const handleViewDetails = () => {
    if (typeof onViewDetails === 'function') onViewDetails(name, category)
  }

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-img" src={image} alt={name} />
        <div className="counter">
          <button className="counter-btn decrement-btn" onClick={handleDecrement} disabled={itemCount === 0}>-</button>
          <span className="counter-value">{itemCount}</span>
          <button className="counter-btn increment-btn" onClick={handleIncrement}>+</button>
        </div>
        <button className="favorite-btn" onClick={handleAddToFavorites} aria-label={`Add ${name} to favorites`}>
          ❤️
        </button>
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <div className="rating-block">
            <span className="rating-stars">{renderStars(rating)}</span>
          </div>
        </div>
        <p className="food-item-desc">{description}</p>
        <div className="food-item-price">
          <p>₹{price}</p>
        </div>
        <button className="view-details-btn" onClick={handleViewDetails}>
          View Details
        </button>
      </div>
    </div>
  )
}

export default FoodItem

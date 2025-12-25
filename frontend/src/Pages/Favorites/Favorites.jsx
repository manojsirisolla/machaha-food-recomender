import React from 'react'
import { useCart } from '../../Context/CartContext'
import { useNavigate } from 'react-router-dom'
import './Favorites.css'

const Favorites = () => {
  const { favorites, addToCart, removeFromFavorites } = useCart()
  const navigate = useNavigate()

  const handleAddToCart = (item) => {
    addToCart(item)
    navigate('/cart')
  }

  const handleRemoveFromFavorites = (id) => {
    removeFromFavorites(id)
  }

  return (
    <div className="favorites">
      <h1>My Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites yet.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((item) => (
            <div key={item.id} className="favorite-item">
              <img src={item.image} alt={item.name} />
              <div className="favorite-info">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>${item.price}</p>
                <div className="btn-group">
                  <button className="add-cart" onClick={() => handleAddToCart(item)}>Add to Cart</button>
                  <button className="remove-btn" onClick={() => handleRemoveFromFavorites(item.id)}>Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Favorites

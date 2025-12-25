import React, { useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';

const Navbar = ({ setShowLogin, user, setUser }) => {
  const [menu, setMenu] = useState('home');
  const navigate = useNavigate();
  const { cartItems, favorites } = useCart();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const handleMenuClick = () => {
    setMenu('menu');
    navigate('/menu');
  };

  const handleMobileAppClick = () => {
    setMenu('mobile');
    navigate('/mobile-app');
  };

  return (
    <div className='navbar'>
      <div className="logo-container" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img
          src={assets.logo}
          alt="logo"
          className="logo"
        />
        <div className="logo-text">
          <h1 className="logo-main">machaha recipes</h1>
        </div>
      </div>

      <ul className="navbar-menu">
        <li onClick={() => { setMenu('home'); navigate('/'); }}
            className={menu === 'home' ? 'active' : ''}>
          Home
        </li>

        <li onClick={handleMenuClick}
            className={menu === 'menu' ? 'active' : ''}>
          Menu
        </li>

        <li onClick={handleMobileAppClick}
            className={menu === 'mobile' ? 'active' : ''}>
          Mobile App
        </li>

        <li onClick={() => { setMenu('contact'); navigate('/contact-us'); }}
            className={menu === 'contact' ? 'active' : ''}>
          Contact Us
        </li>
      </ul>

      <div className="navbar-right">
        <div className="navbar-favorite-container">
          <img
            src={assets.favorite_icon}
            alt="favorites"
            className="navbar-favorite"
            onClick={() => navigate('/favorites')}
            style={{ cursor: 'pointer' }}
          />
          {favorites.length > 0 && (
            <span className="favorite-count-badge">{favorites.length}</span>
          )}
        </div>
        <div className="navbar-basket-container">
          <img
            src={assets.basket_icon}
            alt="basket"
            className="navbar-basket"
            onClick={() => navigate('/cart')}
            style={{ cursor: 'pointer' }}
          />
          {cartItems.length > 0 && (
            <span className="cart-count-badge">{cartItems.length}</span>
          )}
        </div>

        {user ? (
          <div className="navbar-user">
            <span>Welcome, {user.name}</span>
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <button className="signin-button" onClick={() => setShowLogin(true)}>
            Sign in
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;

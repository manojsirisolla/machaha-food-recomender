// src/Pages/Home/Home.jsx
import React from 'react';
import './Home.css';
import Header from '../../Components/Header/Header';
import Chatbot from '../../Components/Chatbot/Chatbot';

const Home = () => {
  return (
    <div className="home-page">
      <div id="home">
        <Header />
      </div>
      
      <div className="home-features">
        <div className="feature-section">
          <h2>Welcome to Machaha Recipes</h2>
          <p>Discover delicious and healthy recipes crafted with love and care. Our platform brings you the finest selection of nutritious meals to support your wellness journey.</p>
        </div>
        
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Fresh Ingredients</h3>
            <p>We use only the freshest, highest-quality ingredients to create meals that are both delicious and nutritious.</p>
          </div>
          <div className="feature-card">
            <h3>Expert Chefs</h3>
            <p>Our experienced chefs craft each recipe with passion and attention to detail, ensuring exceptional taste and presentation.</p>
          </div>
          <div className="feature-card">
            <h3>Healthy Options</h3>
            <p>Enjoy a wide variety of healthy meal options that cater to different dietary preferences and nutritional needs.</p>
          </div>
        </div>
      </div>
      
      <Chatbot />
    </div>
  );
};

export default Home;

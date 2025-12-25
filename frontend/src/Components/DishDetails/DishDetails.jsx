 import React, { useState } from 'react';
import './DishDetails.css';
import { menuData } from '../../menu_data/menu_data.js';
import { assets } from '../../assets/assets.js';

const DishDetails = ({ dishName, category, onClose }) => {
  const [language, setLanguage] = useState('en'); // 'en', 'te', 'hi'

  // Find the dish in menuData based on category and name
  const categoryData = menuData[category];
  const dish = categoryData ? categoryData.find(item => item.name.en.toLowerCase() === dishName.toLowerCase()) : null;

  console.log('dishName:', dishName, 'category:', category, 'categoryData:', categoryData, 'dish:', dish);

  if (!dish) {
    return (
      <div className="dish-details-overlay">
        <div className="dish-details">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>Dish not found</h2>
        </div>
      </div>
    );
  }

  const getTranslatedText = (key) => {
    const translations = {
      en: {
        ingredients: 'Ingredients:',
        preparation: 'Preparation:'
      },
      te: {
        ingredients: 'పదార్థాలు:',
        preparation: 'తయారీ:'
      },
      hi: {
        ingredients: 'सामग्री:',
        preparation: 'तैयारी:'
      }
    };
    return translations[language][key] || key;
  };

  return (
    <div className="dish-details-overlay">
      <div className="dish-details">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{dish.name[language]}</h2>
        <div className="ingredients">
          <h3>{getTranslatedText('ingredients')}</h3>
          <ul>
            {dish.ingredients[language].map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="preparation">
          <h3>{getTranslatedText('preparation')}</h3>
          <ol>
            {dish.preparation[language].map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
        <div className="language-buttons">
          <button onClick={() => setLanguage('en')}>English</button>
          <button onClick={() => setLanguage('te')}>తెలుగు</button>
          <button onClick={() => setLanguage('hi')}>हिंदी</button>
        </div>
      </div>
    </div>
  );
};

export default DishDetails;

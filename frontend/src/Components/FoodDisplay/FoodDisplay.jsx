// src/Components/FoodDisplay/FoodDisplay.jsx
import React, { useState } from 'react';
import './FoodDisplay.css';
import { food_list } from '../../assets/assets';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category, onViewDetails }) => {
  // keep a local mutable list so items can be removed when selected
  const [items, setItems] = useState(food_list)

  // filter items by category
  const filteredItems = category === 'All' 
    ? items 
    : items.filter((it) => it.category === category)

  const handleSelectAndRemove = (id) => {
    setItems((prev) => prev.filter((it) => it._id !== id))
  }

  return (
    <div className='food-display' id='food-display'>
      <h2>Top dishes near you</h2>

      <div className="food-display-list">
        {filteredItems.map((item, index) => (
          <FoodItem
            key={index}
            id={item._id}
            name={item.name}
            description={item.description}
            image={item.image}
            price={item.price}
            category={item.category}
            onSelectAndRemove={handleSelectAndRemove}
            onViewDetails={onViewDetails}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodDisplay;




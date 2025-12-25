import React, { useState } from 'react';
import './Menu.css';
import ExploreMenu from '../../Components/ExploreMenu/ExploreMenu';
import FoodDisplay from '../../Components/FoodDisplay/FoodDisplay';
import DishDetails from '../../Components/DishDetails/DishDetails';

const Menu = () => {
  const [category, setCategory] = useState('All');
  const [selectedDish, setSelectedDish] = useState(null);

  const handleViewDetails = (dishName, dishCategory) => {
    setSelectedDish({ name: dishName, category: dishCategory });
  };

  const handleCloseDetails = () => {
    setSelectedDish(null);
  };

  return (
    <div className="menu-page">
      <div className="menu-hero">
        <h1>Our Menu</h1>
        <p>Discover our delicious selection of healthy recipes and food items</p>
      </div>
      
      <div className="menu-content">
        <ExploreMenu category={category} setCategory={setCategory} />
        <FoodDisplay category={category} onViewDetails={handleViewDetails} />
      </div>

      {selectedDish && (
        <DishDetails
          dishName={selectedDish.name}
          category={selectedDish.category}
          onClose={handleCloseDetails}
        />
      )}
    </div>
  );
};

export default Menu;

import React, { useState } from 'react';
import Navbar from './Components/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Notification from './Components/Notification/Notification';

import Home from './Pages/Home/Home';
import Menu from './Pages/Menu/Menu';
import MobileApp from './Pages/MobileApp/MobileApp';
import ContactUs from './Pages/ContactUs/ContactUs';
import Cart from './Pages/Cart/Cart';
import Checkout from './Pages/Checkout/Checkout';
import OrderConfirmation from './Pages/OrderConfirmation/OrderConfirmation';
import Favorites from './Pages/Favorites/Favorites';
import AboutUs from './Pages/AboutUs/AboutUs';
import PrivacyPolicy from './Pages/PrivacyPolicy/PrivacyPolicy';
import Footer from './FoodItem/Footer/Footer';
import LoginPopup from './Components/LoginPopup/LoginPopup';

const App = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  return (
    <>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} setUser={setUser} />}
      <Notification />

      <div className="app">
        <Navbar setShowLogin={setShowLogin} user={user} setUser={setUser} />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/mobile-app" element={<MobileApp />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>

        <Footer />
      </div>
    </>
  );
};

export default App;

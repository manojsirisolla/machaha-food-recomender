import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useCart } from "../../Context/CartContext";
import { useNotification } from "../../Context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [deliveryOption, setDeliveryOption] = useState("express");
  const [showScanner, setShowScanner] = useState(false);

  useEffect(() => {
    if (paymentMethod === "upi") {
      setShowScanner(true);
    } else {
      setShowScanner(false);
    }
  }, [paymentMethod]);

  const calculateTotal = () => {
    return cartItems
      .reduce(
        (total, item) =>
          total + parseFloat(item.price || 0) * (item.quantity || 1),
        0
      )
      .toFixed(2);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Order summary - always allow next
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // Address validation
      if (
        !address.name ||
        !address.phone ||
        !address.street ||
        !address.city ||
        !address.state ||
        !address.zipCode
      ) {
        showNotification("⚠️ Please fill in all address fields", 3000);
        return;
      }
      setCurrentStep(3);
    } else if (currentStep === 3) {
      // Delivery options - always allow next
      setCurrentStep(4);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddressChange = (e) => {
    setAddress({
      ...address,
      [e.target.name]: e.target.value,
    });
  };

  const handleBuyNow = async () => {
    if (cartItems.length === 0) {
      showNotification("❌ Your cart is empty!", 3000);
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        showNotification("⚠️ Please login first", 3000);
        setIsPlacingOrder(false);
        return;
      }

      const subtotal = parseFloat(calculateTotal());
      const deliveryFee = subtotal <= 50 ? 40 : 30;
      const finalTotal = subtotal + deliveryFee;

      const orderTime = new Date();
      const orderData = {
        items: cartItems,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        total: finalTotal.toFixed(2),
        address: address,
        paymentMethod: "card", // Default to card payment for Buy Now
        deliveryOption: deliveryOption,
        orderTime: orderTime.toISOString(),
        delivery: {
          date: orderTime.toISOString().split("T")[0], // YYYY-MM-DD format
          time: orderTime.toTimeString().split(" ")[0], // HH:MM:SS format
        },
      };

      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const orderData = await response.json();
        showNotification("✅ Order placed successfully!", 3000);
        clearCart();
        navigate("/order-confirmation", { state: { order: orderData.order } });
      } else {
        showNotification("❌ Failed to place order", 3000);
      }
    } catch (error) {
      console.error("Order error:", error);
      showNotification("❌ Error placing order", 3000);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const isMobile = () => {
    return window.innerWidth <= 768;
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      showNotification("❌ Your cart is empty!", 3000);
      return;
    }

    setIsPlacingOrder(true);

    try {
      const token = localStorage.getItem("token");

      if (!token && !isMobile()) {
        showNotification("⚠️ Please login first", 3000);
        setIsPlacingOrder(false);
        return;
      }

      const subtotal = parseFloat(calculateTotal());
      const deliveryFee = subtotal <= 50 ? 40 : 30;
      const tax = subtotal * 0.18;
      const finalTotal = subtotal + deliveryFee + tax;

      const orderTime = new Date();
      const orderData = {
        items: cartItems,
        subtotal: subtotal.toFixed(2),
        deliveryFee: deliveryFee.toFixed(2),
        tax: tax.toFixed(2),
        total: finalTotal.toFixed(2),
        address: address,
        paymentMethod: paymentMethod,
        deliveryOption: deliveryOption,
        orderTime: orderTime.toISOString(),
        delivery: {
          date: orderTime.toISOString().split("T")[0], // YYYY-MM-DD format
          time: orderTime.toTimeString().split(" ")[0], // HH:MM:SS format
        },
      };

      const response = await fetch("http://localhost:8080/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const orderData = await response.json();
        showNotification("✅ Order placed successfully!", 3000);
        clearCart();
        navigate("/order-confirmation", { state: { order: orderData.order } });
      } else {
        showNotification("❌ Failed to place order", 3000);
      }
    } catch (error) {
      console.error("Order error:", error);
      showNotification("❌ Error placing order", 3000);
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const total = calculateTotal();

  const renderStepIndicator = () => (
    <div className="step-indicator">
      <div className={`step ${currentStep >= 1 ? "active" : ""}`}>
        <span className="step-number">1</span>
        <span className="step-label">Order Summary</span>
      </div>
      <div className={`step-line ${currentStep > 1 ? "active" : ""}`}></div>
      <div className={`step ${currentStep >= 2 ? "active" : ""}`}>
        <span className="step-number">2</span>
        <span className="step-label">Address</span>
      </div>
      <div className={`step-line ${currentStep > 2 ? "active" : ""}`}></div>
      <div className={`step ${currentStep >= 3 ? "active" : ""}`}>
        <span className="step-number">3</span>
        <span className="step-label">Delivery</span>
      </div>
      <div className={`step-line ${currentStep > 3 ? "active" : ""}`}></div>
      <div className={`step ${currentStep >= 4 ? "active" : ""}`}>
        <span className="step-number">4</span>
        <span className="step-label">Payment</span>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className="checkout-step">
      <h3>Order Summary</h3>
      <div className="order-items">
        {cartItems.map((item, idx) => (
          <div className="order-item" key={idx}>
            <img src={item.image} alt={item.name} className="order-item-img" />
            <div className="order-item-info">
              <p className="order-item-name">{item.name}</p>
              <p className="order-item-price">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="order-total">
        <div className="order-breakdown">
          <p>Subtotal: ₹{total}</p>
          <p>Delivery Fee: ₹{parseFloat(total) <= 50 ? 40 : 30}</p>
        </div>
        <p className="total-amount">
          Total: ₹
          {(parseFloat(total) + (parseFloat(total) <= 50 ? 40 : 30)).toFixed(2)}
        </p>
      </div>
      <div className="order-next">
        <button className="btn-primary" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );

  const renderAddressForm = () => (
    <div className="checkout-step">
      <h3>Delivery Address</h3>
      <form className="address-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={address.name}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={address.phone}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="street">Street Address</label>
          <input
            type="text"
            id="street"
            name="street"
            value={address.street}
            onChange={handleAddressChange}
            required
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="state">State</label>
            <input
              type="text"
              id="state"
              name="state"
              value={address.state}
              onChange={handleAddressChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="zipCode">ZIP Code</label>
            <input
              type="text"
              id="zipCode"
              name="zipCode"
              value={address.zipCode}
              onChange={handleAddressChange}
              required
            />
          </div>
        </div>
      </form>
    </div>
  );

  const renderDeliveryOptions = () => (
    <div className="checkout-step">
      <h3>Delivery Options</h3>
      <div className="delivery-options">
        <label className="delivery-option">
          <input
            type="radio"
            name="delivery"
            value="express"
            checked={deliveryOption === "express"}
            onChange={(e) => setDeliveryOption(e.target.value)}
          />
          <div className="delivery-info">
            <span className="delivery-name">Express Delivery</span>
            <span className="delivery-time">15-30 min</span>
            <span className="delivery-price">₹50</span>
          </div>
        </label>
        <label className="delivery-option">
          <input
            type="radio"
            name="delivery"
            value="standard"
            checked={deliveryOption === "standard"}
            onChange={(e) => setDeliveryOption(e.target.value)}
          />
          <div className="delivery-info">
            <span className="delivery-name">Standard Delivery</span>
            <span className="delivery-time">30 min - 1 hour</span>
            <span className="delivery-price">₹30</span>
          </div>
        </label>
      </div>
    </div>
  );

  const handleScanClick = () => {
    window.open(assets.qr_code, "_blank");
    // Simulate successful payment and auto-place order
    handlePlaceOrder();
  };

  const renderScanner = () => (
    <div className="checkout-step">
      <h3>Scan QR Code</h3>
      <div className="scanner-container">
        <div className="scanner-placeholder">
          <p>Scan the QR code with your UPI app</p>
          <div className="qr-section">
            <div className="qr-placeholder">
              <span>QR Code Placeholder</span>
            </div>
            <button className="scan-btn" onClick={handleScanClick}>
              Scan
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentForm = () => (
    <div className="checkout-step">
      <h3>Payment Method</h3>
      <div className="payment-options">
        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="cash"
            checked={paymentMethod === "cash"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>Cash on Delivery</span>
        </label>

        <label className="payment-option">
          <input
            type="radio"
            name="payment"
            value="upi"
            checked={paymentMethod === "upi"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />
          <span>UPI</span>
        </label>
      </div>
      {paymentMethod && (
        <div className="order-confirmation">
          <h4>Order Confirmation</h4>
          <div className="confirmation-details">
            <div className="confirmation-item">
              <span>Items:</span>
              <span>{cartItems.length} item(s)</span>
            </div>
            <div className="confirmation-item">
              <span>Delivery Address:</span>
              <span>
                {address.name}, {address.street}, {address.city}
              </span>
            </div>
            <div className="confirmation-item">
              <span>Payment:</span>
              <span>
                {paymentMethod === "cash" ? "Cash on Delivery" : "UPI"}
              </span>
            </div>
            <div className="confirmation-item total">
              <span>Total Amount:</span>
              <span>
                ₹
                {(
                  parseFloat(total) + (parseFloat(total) <= 50 ? 40 : 30)
                ).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="checkout-page">
      <h2>Checkout</h2>
      {renderStepIndicator()}
      <div className="checkout-content">
        {currentStep === 1 && renderOrderSummary()}
        {currentStep === 2 && renderAddressForm()}
        {currentStep === 3 && renderDeliveryOptions()}
        {currentStep === 4 &&
          (showScanner ? renderScanner() : renderPaymentForm())}
      </div>
      <div className="checkout-actions">
        {currentStep > 1 && (
          <button className="btn-secondary" onClick={handlePrev}>
            Previous
          </button>
        )}
        {currentStep > 1 && currentStep < 4 ? (
          <button className="btn-primary" onClick={handleNext}>
            Next
          </button>
        ) : currentStep === 4 ? (
          <button
            className="btn-primary"
            onClick={() => {
              console.log("Place Order clicked");
              console.log("paymentMethod:", paymentMethod);
              console.log("isPlacingOrder:", isPlacingOrder);
              console.log("address:", address);
              handlePlaceOrder();
            }}
            disabled={isPlacingOrder || !paymentMethod}
          >
            {isPlacingOrder ? "Processing..." : "Place Order"}
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default Checkout;

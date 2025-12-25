import React, { useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import api from '../../api';

const LoginPopup = ({ setShowLogin, setUser }) => {
  const [currState, setCurrState] = useState("login"); // login or signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setSuccess('Login successful');
        setTimeout(() => setShowLogin(false), 2000);
      } else {
        // Display the actual backend error message
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.token) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', JSON.stringify(result.user));
        setUser(result.user);
        setSuccess('Registration successful');
        setTimeout(() => setShowLogin(false), 2000);
      } else {
        // Display the actual backend error message
        setError(result.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-popup">
      <div className="login-popup-container">

        <div className="login-popup-title">
          <h2>{currState === "login" ? "Login" : "Sign Up"}</h2>
          <img
            src={assets.cross_icon}
            alt="close"
            onClick={() => setShowLogin(false)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        {currState === "login" ? (
          <div className="login-popup-inputs">
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="login-btn" onClick={handleLogin}>Login</button>
            <p>
              Don’t have an account?{" "}
              <span onClick={() => setCurrState("signup")}>Sign Up</span>
            </p>
          </div>
        ) : (
          <div className="login-popup-inputs">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button className="login-btn" onClick={handleSignUp}>Sign Up</button>
            <p>
              Already have an account?{" "}
              <span onClick={() => setCurrState("login")}>Login</span>
            </p>
          </div>
        )}

      </div>
    </div>
  );
};

export default LoginPopup;

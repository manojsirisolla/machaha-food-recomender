import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
  return (
    <div className="about-us">
      <div className="about-us-header">
        <h1>About Hachama.com</h1>
        <p>Your ultimate destination for delicious recipes and food delivery</p>
      </div>

      <div className="about-us-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            At Hachama.com, we're passionate about bringing the joy of cooking and great food to your doorstep.
            Our platform connects food lovers with authentic recipes from around the world, featuring
            multilingual support for English, Telugu, and Hindi to make cooking accessible to everyone.
          </p>
        </section>

        <section className="about-section">
          <h2>What We Offer</h2>
          <ul>
            <li><strong>Authentic Recipes:</strong> Explore a wide variety of dishes including Pasta, Noodles, Biryani, and more</li>
            <li><strong>Multilingual Support:</strong> Recipes available in English, Telugu, and Hindi</li>
            <li><strong>Community:</strong> Share your cooking experiences and discover new favorites</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>Our Story</h2>
          <p>
            Hachama.com was born from a love for food and a desire to make cooking more accessible.
            We believe that everyone should have the opportunity to enjoy delicious, homemade meals
            regardless of their location or language. Our team of culinary experts and developers work
            tirelessly to bring you the best recipes and food delivery experience.
          </p>
        </section>



        <section className="contact-section">
          <h2>Contact Us</h2>
          <div className="contact-info">
            <p><strong>Phone:</strong> +91 9346309988</p>
            <p><strong>Email:</strong> contact@Hachama.com</p>
            <p><strong>Address:</strong> Andhra Odisha Border, Pathapatnam</p>
          </div>
          <p>
            Have questions, suggestions, or need assistance? We'd love to hear from you!
            Reach out to our team anytime.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;

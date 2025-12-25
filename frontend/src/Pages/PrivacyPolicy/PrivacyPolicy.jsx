import React from 'react';
import './PrivacyPolicy.css';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy">
      <div className="privacy-policy-header">
        <h1>Privacy Policy</h1>
        <p>At Recipe Hub, we are committed to protecting your privacy and ensuring the security of your personal information.</p>
      </div>

      <div className="privacy-policy-content">
        <section className="privacy-section">
          <p>
            This privacy policy explains how we collect, use, and safeguard your data when you use our recipe platform.
          </p>

          <h3>Information We Collect</h3>
          <ul>
            <li><strong>Personal Information:</strong> Name, email address, and account details when you register</li>
            <li><strong>Usage Data:</strong> Recipes viewed, search queries, and interaction patterns</li>
            <li><strong>Cookies:</strong> We use cookies to enhance your browsing experience and remember your preferences</li>
          </ul>

          <h3>How We Use Your Information</h3>
          <ul>
            <li>To provide and maintain our recipe services</li>
            <li>To personalize your experience with relevant recipe recommendations</li>
            <li>To communicate with you about updates, new features, and recipes</li>
            <li>To improve our platform based on user feedback and usage patterns</li>
          </ul>

          <h3>Data Security</h3>
          <p>
            We implement industry-standard security measures to protect your personal information:
          </p>
          <ul>
            <li>SSL/TLS encryption for data transmission</li>
            <li>Secure password hashing and storage</li>
            <li>Regular security audits and updates</li>
            <li>Limited access to personal data within our team</li>
          </ul>

          <h3>Third-Party Services</h3>
          <p>
            We may use analytics services to understand how our platform is used. These services help us improve
            our offerings, but we do not share your personal information with third parties without your consent.
          </p>

          <h3>Your Rights</h3>
          <p>You have the right to:</p>
          <ul>
            <li>Access and review your personal information</li>
            <li>Update or correct your account details</li>
            <li>Request deletion of your account and associated data</li>
            <li>Opt-out of marketing communications</li>
          </ul>

          <h3>Contact Us About Privacy</h3>
          <p>
            If you have any questions about this privacy policy or our data practices, please contact us.
            We are committed to addressing your privacy concerns promptly.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;

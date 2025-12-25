import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
            <img src={assets.logo} alt="" className="footer-logo" />
            <p> We’re here to help you discover the perfect recipes—anytime, anywhere.
If you have questions, ideas, or need assistance, our team would love to hear from you.</p>
            <div className="footer-social-icons">
                <img src={assets.facebook_icon} alt=""/>
                <img src={assets.twitter_icon} alt=""/>
                <img src={assets.linkdin_icon} alt=""/>

            </div>
            </div>
            <div className="footer-content-center">
            <h2> COMPANY</h2>
            <ul>
                <li> Home </li>
                 <li><Link to="/about-us"> About us </Link></li>
                 <li><Link to="/contact-us"> Contact Us </Link></li>
                   <li><Link to="/privacy-policy"> Privacy policy</Link></li>
            </ul>
            </div>
            <div className="footer-content-right">
                <h2> GET IN TOUCH</h2>
                <ul> 
                    <li> +91 9346309988</li>
                    <li> contact @Hachama.com</li>
                </ul>

            </div>
        </div>
        <hr/>
        <p className="footer-copyright">Copyright 2025 @Hachama.com - All right Reversed</p>
      </div>
  )
}

export default Footer

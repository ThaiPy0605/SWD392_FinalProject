import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="landing-footer">
    <div className="landing-footer__inner">
      <div className="landing-footer__brand">
        <span className="landing-brand__mark" aria-hidden="true">O</span>
        <div>
          <strong>OhStem Education</strong>
          <p>Practical robotics and IoT learning for every classroom.</p>
        </div>
      </div>
      <nav className="landing-footer__links" aria-label="Footer links">
        <Link to="/">Catalog</Link>
        <a href="#learning">Learning paths</a>
        <a href="#schools">For schools</a>
        <a href="#support">Support</a>
      </nav>
      <p className="landing-footer__copyright">© 2026 OhStem. Built for young makers.</p>
    </div>
  </footer>
);

export default Footer;

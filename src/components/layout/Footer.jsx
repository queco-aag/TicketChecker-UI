import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} ASPADIF - Asociación de Padres de Personas con Discapacidad Intelectual de Fuenlabrada</p>
        <p className="footer-link">
          <a href="http://www.aspadif.org" target="_blank" rel="noopener noreferrer">
            www.aspadif.org
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;

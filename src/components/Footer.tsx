import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-burgundy-primary text-cream-light py-8 mt-16">
      <div className="container mx-auto px-4 text-center">
        <p>&copy; {currentYear} ODE Food Hall. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
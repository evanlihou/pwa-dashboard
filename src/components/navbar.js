import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const NavItem = ({ to, children }) => {
  const location = useLocation();
  return (
    <Link to={to} className={`navbar-item ${location.pathname === to ? 'is-active' : ''}`}>
      {children}
    </Link>
  );
};

const Navbar = () => (
  <nav className="navbar is-fixed-bottom is-spaced" role="navigation" aria-label="main navigation">
    <div id="navbarBasicExample" className="navbar-menu is-flex is-justify-content-center">
      <NavItem to="/dashboard">Dashboard</NavItem>
      <NavItem to="/timetrack">Timetrack</NavItem>
    </div>
  </nav>
);

export default Navbar;

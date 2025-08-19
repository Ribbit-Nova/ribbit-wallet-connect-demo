import React from 'react';
import { NavLink } from 'react-router-dom';

const Header: React.FC = () => (
  <header style={{ padding: '1rem', background: '#f5f5f5' }}>
    <nav
      style={{
        display: 'flex',
        justifyContent: 'start',
        alignItems: 'center',
        height: '3rem',
      }}
    >
      <NavLink to="/" style={{ marginRight: '1rem' }} end>
        Home
      </NavLink>
      <NavLink to="/about" end>
        About
      </NavLink>
    </nav>
  </header>
);

export default Header;

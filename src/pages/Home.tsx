import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { rootStore } from "../stores/rootStore";
import logo from '../assets/images/logo.png'

const Home: React.FC = observer(() => {
  const { authStore } = rootStore;
  const navigate = useNavigate();

  useEffect(() => {
    // later to set, if user is already logged in redirect to dashboard. if not go to landing page
  }, []);

  return (
    <div>
      <nav style={styles.navbar}>
        <img src={logo} style={styles.navbarLogo} />
        <ul style={styles.navbarMenu}>
          <li style={styles.navbarMenuItem}>
            <Link to="/landingpage" style={{ ...styles.navbarMenuItemLink, ...(window.location.pathname === '/landingpage' ? styles.activeLink : {}) }}>Welcome</Link>
          </li>
          <li style={styles.navbarMenuItem}>
            <Link to="/dashboard" style={{ ...styles.navbarMenuItemLink, ...(window.location.pathname === '/dashboard' ? styles.activeLink : {}) }}>Dashboard</Link>
          </li>
          <li style={styles.navbarMenuItem}>
            <Link to="/faq" style={{ ...styles.navbarMenuItemLink, ...(window.location.pathname === '/faq' ? styles.activeLink : {}) }}>FAQ</Link>
          </li>
          <li style={styles.navbarMenuItem}>
            <Link to="/about" style={{ ...styles.navbarMenuItemLink, ...(window.location.pathname === '/about' ? styles.activeLink : {}) }}>About</Link>
          </li>
          <li style={styles.navbarMenuItem}>
            <Link to="/watchdemo" style={{ ...styles.navbarMenuItemLink, ...(window.location.pathname === '/watchdemo' ? styles.activeLink : {}) }}>Watch Demo</Link>
          </li>
        </ul>
        <div style={styles.navbarEnd}>
          {authStore.user ? (
            <div>
              <button style={styles.logOutButton} onClick={authStore.logout}>Logout</button>
            </div>
          ) : (
            <div>
              <Link to="/login" style={styles.smallerButton}>Login</Link>
              <Link to="/signup" style={styles.smallerButton}>Sign Up</Link>
            </div>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
});

const styles = {
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    color: '#333',
    padding: '10px',
    height: '50px',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  navbarLogo: {
    marginLeft: '10px',
    color: '#333',
    width: '48px'
  },
  navbarMenu: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
  },
  navbarMenuItem: {
    padding: '5px 10px',
  },
  navbarMenuItemLink: {
    textDecoration: 'none',
    color: '#333',
    
  },
  activeLink: {
    fontWeight: 'bold',     
  },
  navbarMenuItemLinkHover: {
    textDecoration: 'underline',
  },
  navbarEnd: {
    display: 'flex',
    alignItems: 'center',
    width: '180px'
  },
  logOutButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '6px 15px',
    cursor: 'pointer',
    borderRadius: '15px',
    fontSize: '1rem',
    marginLeft: '10px',
  },
  smallerButton: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    padding: '6px 15px',
    cursor: 'pointer',
    borderRadius: '15px',
    fontSize: '16px',
    marginLeft: '10px',
  },
};

export default Home;

import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";
import logo from '../../assets/images/logo.png'
import { useAuthHandlers } from '../../handlers/authHandler';
import { position } from 'html2canvas/dist/types/css/property-descriptors/position';
import { zIndex } from 'html2canvas/dist/types/css/property-descriptors/z-index';

const Nav: React.FC = observer(() => {
    const { authStore } = rootStore;
    const location = useLocation();
    const { handleLogout } = useAuthHandlers();
    const navigate = useNavigate()

    return (
        <nav style={styles.navbar}>
            <img src={logo} style={styles.navbarLogo} />
            <ul style={styles.navbarMenu}>
                <li style={styles.navbarMenuItem}>
                    <Link to="/landingpage" style={{ ...styles.navbarMenuItemLink, ...(location.pathname === '/landingpage' ? styles.activeLink : {}) }}>Welcome</Link>
                </li>
                <li style={styles.navbarMenuItem}>
                    <Link to="/dashboard" style={{ ...styles.navbarMenuItemLink, ...(location.pathname === '/dashboard' ? styles.activeLink : {}) }}>Dashboard</Link>
                </li>
                <li style={styles.navbarMenuItem}>
                    <Link to="/faq" style={{ ...styles.navbarMenuItemLink, ...(location.pathname === '/faq' ? styles.activeLink : {}) }}>FAQ</Link>
                </li>
                <li style={styles.navbarMenuItem}>
                    <Link to="/about" style={{ ...styles.navbarMenuItemLink, ...(location.pathname === '/about' ? styles.activeLink : {}) }}>About</Link>
                </li>
                <li style={styles.navbarMenuItem}>
                    <Link to="/demo" style={{ ...styles.navbarMenuItemLink, ...(location.pathname === '/demo' ? styles.activeLink : {}) }}>Try Demo</Link>
                </li>
                <li style={styles.navbarMenuItem}>
                    <Link to="/market" style={{ ...styles.navbarMenuItemLink, ...(location.pathname === '/market' ? styles.activeLink : {}) }}>Market</Link>
                </li>
            </ul>
            <div style={styles.navbarEnd}>
                {authStore.user ? (
                    <div>
                        <button style={styles.logOutButton} onClick={() => handleLogout((navigate))}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <Link to="/login" style={styles.smallerButton}>Login</Link>
                        <Link to="/signup" style={styles.smallerButton}>Sign Up</Link>
                    </div>
                )}
            </div>
        </nav>
    );
});

const styles = {
    navbar: {
        display: 'flex',
        position: 'sticky' as const,
        top: '0px',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        color: '#333',
        padding: '10px',
        height: '50px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        zIndex: 100
    },
    navbarLogo: {
        marginLeft: '10px',
        color: '#333',
        width: '40px'
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
        fontSize: '16px',
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

export default Nav;

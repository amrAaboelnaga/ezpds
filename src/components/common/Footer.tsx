import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const contactLink = '/contact';
const aboutLink = '/about';
const facebookLink = '/facebook';
const twitterLink = '/twitter';
const linkedInLink = '/linkedin';
const aboutUsLink = '/about-us';
const privacyPolicyLink = '/privacy-policy';
const termsOfServiceLink = '/terms-of-service';


const Footer: React.FC = (() => {
    const navigate = useNavigate()

    return (
        <footer style={styles.footer}>
            <div style={styles.footerContent}>
                <div style={styles.elementsCont}>
                    <h3 style={styles.element}>Contact Us</h3>
                    <p style={styles.element}>Email: contact@ezpds.com</p>
                    <p style={styles.element}>Phone: +1 (123) 456-7890</p>
                </div>
                <div style={styles.elementsCont}>
                    <h3 style={styles.element}>Follow Us</h3>
                    <p>
                        <a style={styles.link} href={facebookLink} >Facebook</a><span> | </span>
                        <a style={styles.link} href={twitterLink}  >Twitter</a><span> | </span>
                        <a style={styles.link} href={linkedInLink} >LinkedIn</a>
                    </p>
                </div>
                <div style={styles.elementsCont}>
                    <h3 style={styles.element} onClick={() => navigate(aboutLink)}>About</h3>
                    <p>
                        <span style={styles.link} onClick={() => navigate(aboutUsLink)}>About Us</span><span> | </span>
                        <span style={styles.link} onClick={() => navigate(privacyPolicyLink)}>Privacy Policy</span><span> | </span>
                        <span style={styles.link} onClick={() => navigate(termsOfServiceLink)}>Terms of Service</span>
                    </p>
                </div>
            </div>
        </footer>
    );
});
const styles = {
    footer: {
        zIndex: '2',
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px 0',
        marginTop: 'auto',
        width: '100%',

    },
    footerContent: {
        display: 'flex',
        justifyContent: 'space-around',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    elementsCont: {
        display: 'flex',
        flexDirection: 'column' as const
    },
    element: {
        margin: '5px '
    },
    link: {
        color: 'white',
        textDecoration: 'underline'
    }
};

export default Footer;

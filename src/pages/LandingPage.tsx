import React from 'react';
import landingImage from '../assets/images/landingPhoto.jpeg'
import { useNavigate } from 'react-router-dom';

const contactLink = '/contact';
const aboutLink = '/about';
const facebookLink = '/facebook';
const twitterLink = '/twitter';
const linkedInLink = '/linkedin';
const aboutUsLink = '/about-us';
const privacyPolicyLink = '/privacy-policy';
const termsOfServiceLink = '/terms-of-service';


const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <div style={styles.content}>
        <h1>Welcome to EZ-PDS!</h1>
        <p>Your go-to platform for creating DFP files from templates.</p>

      </div>
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div>
            <h3>Contact Us</h3>
            <p>Email: contact@ezpds.com</p>
            <p>Phone: +1 (123) 456-7890</p>
          </div>
          <div>
            <h3>Follow Us</h3>
            <p>
              <a style={styles.link} href={facebookLink} >Facebook</a><span> | </span>
              <a style={styles.link} href={twitterLink}  >Twitter</a><span> | </span>
              <a style={styles.link} href={linkedInLink} >LinkedIn</a>
            </p>
          </div>
          <div>
            <h3 onClick={() => navigate(aboutLink)}>About</h3>
            <p>
              <span style={styles.link} onClick={() => navigate(aboutUsLink)}>About Us</span><span> | </span>
              <span style={styles.link} onClick={() => navigate(privacyPolicyLink)}>Privacy Policy</span><span> | </span>
              <span style={styles.link} onClick={() => navigate(termsOfServiceLink)}>Terms of Service</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

// Styles object for modern styling
const styles = {
  page: {
    height: 'calc(100vh - 50px)',
    display: 'flex',
    width: '100%',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    backgroundImage: `url(${landingImage})`,
  },
  content: {
    textAlign: 'center' as const,
    padding: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: '8px',
    width: '100%',
    margin: '0px'
  },
  footer: {
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px 0',
    marginTop: 'auto',
    width: '100%',
  },
  footerContent: {
    display: 'flex',
    justifyContent: 'space-around',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  link: {
    color: 'white',
    textDecoration: 'underline'
  }
};

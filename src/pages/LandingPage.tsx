import React from 'react';
import landingImage from '../assets/images/landingPhoto.jpeg'
import { useNavigate } from 'react-router-dom';
import LandingHero from '../components/common/LandingHero';

const LandingPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <LandingHero />
    </div>
  );
};

export default LandingPage;


const styles = {
  page: {
    display: 'flex',
    height: '100%',    
    width: '100%',
    flexDirection: 'column' as const,
    alignItems: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: '#fff',
    fontFamily: 'Arial, sans-serif',
    backgroundImage: `url(${landingImage})`,

  }
};

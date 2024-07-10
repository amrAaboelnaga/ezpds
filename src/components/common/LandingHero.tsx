import React from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";

const LandingHero: React.FC = observer(() => {
    const { authStore } = rootStore;

    return (
        <div style={styles.hero}>
            <h1>Welcome to EZ-PDS!</h1>
            <p>Your go-to platform for creating PDF files from templates.</p>
        </div>
    );
});

const styles = {    
    hero: {
      textAlign: 'center' as const,
      padding: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      width: '100%',
      position: 'relative' as const,
      top: '0px',
    }
  };

export default LandingHero;

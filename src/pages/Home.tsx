import React, { useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { rootStore } from "../stores/rootStore";
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';

const Home: React.FC = observer(() => {
  const { authStore } = rootStore;
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStore.user) {
      navigate('/landingpage')
    } else {
      navigate('/dashboard')
    }
  }, []);

  return (
    <div style={styles.homeCont} >
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
});

const styles = {
  homeCont: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column' as const,
  }
};

export default Home;

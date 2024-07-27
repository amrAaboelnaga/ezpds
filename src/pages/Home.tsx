import React, { useEffect, useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { rootStore } from "../stores/rootStore";
import Nav from '../components/common/Nav';
import Footer from '../components/common/Footer';
import { useAuthHandlers } from '../handlers/authHandler';
import { fetchAuthSession } from 'aws-amplify/auth';

const Home: React.FC = observer(() => {
  const [checkedUser, setCheckedUser] = useState(false)
  const { authStore } = rootStore;
  const navigate = useNavigate();
  const { handleCheckLogin } = useAuthHandlers();

  useEffect(() => {   
      handleCheckLogin(navigate, setCheckedUser);    
  }, []);

  return (
    <div style={styles.homeCont} >
      <Nav />
      {checkedUser ?
        <Outlet />
        :
        "Loading.."}
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

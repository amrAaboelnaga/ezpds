import React, { useEffect } from 'react';
import { rootStore } from '../stores/rootStore';

const Dashboard: React.FC = () => {
  const { authStore } = rootStore;

  if (authStore.user) {
    return (
      <div style={styles.dashBoardCont}>
        <h1>Welcome {authStore.user.name}</h1>
      </div>
    )
  } else {
    return (
      <div style={styles.dashBoardCont}>
        <h1>Please log in</h1>
      </div>
    )
  }

};

const styles = {
  dashBoardCont: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column' as const,
    alignItems: 'center'
  }
};

export default Dashboard;

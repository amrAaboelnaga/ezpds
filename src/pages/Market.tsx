import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../stores/rootStore';
import MarketSearchBar from '../components/market-components/MarketSearchBar';
import ProductsCont from '../components/market-components/ProductsCont';


const Market: React.FC = () => {
  const { marketStore } = rootStore;


  return (
    <div style={styles.marketContainer}>
      <MarketSearchBar />
      <ProductsCont />
    </div>
  );
};

const styles = {
  marketContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '10px 20px',
  } as React.CSSProperties, 
};


export default observer(Market);

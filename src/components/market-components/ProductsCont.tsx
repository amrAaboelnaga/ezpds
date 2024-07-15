import React from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';
import SingleProductCard from './SingleProductCard';

const ProductsCont: React.FC = () => {
  const { marketStore } = rootStore;


  return (

    <div style={styles.productsContainer}>
      {marketStore.loadingState === 'loading' && (
        <p>Loading...</p>
      )}
      {marketStore.loadingState === 'done' && (
        marketStore.products.map(product => (
          <SingleProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
};

const styles = {
  productsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
    padding: '20px',
  } as React.CSSProperties,
  card: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    width: '300px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
};


export default observer(ProductsCont);

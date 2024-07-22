import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../stores/rootStore';
import { MarketSearchBar } from '../components/market-components/MarketSearchBar';
import { ProductsCont } from '../components/market-components/ProductsCont';
import { maxProducts } from '../handlers/marketHandlers';

const Market: React.FC = () => {
  const { marketStore } = rootStore;
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [latest, setLatest] = useState(false);
  const [includeImage, setIncludeImage] = useState(true);
  const maxProductsPerPage = maxProducts;

  return (
    <div style={styles.marketContainer}>
      <MarketSearchBar
        includeImage={includeImage}
        setIncludeImage={setIncludeImage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        latest={latest}
        setLatest={setLatest}
        maxProductsPerPage={maxProductsPerPage}
      />
      <ProductsCont
        includeImage={includeImage}
        searchTerm={searchTerm}
        category={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
        latest={latest}
        pageSize={maxProductsPerPage}
      />
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

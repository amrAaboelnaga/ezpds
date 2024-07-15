import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';
import { categories } from '../../handlers/marketHandlers';




const MarketSearchBar: React.FC = () => {
  const { marketStore } = rootStore;
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [latest, setLatest] = useState(false);

  useEffect(() => {
    if (marketStore.products.length === 0) {
      marketStore.fetchProducts(searchTerm, category, minPrice, maxPrice, latest);
    }
  }, [])

  const handleSearch = () => {
    marketStore.fetchProducts(searchTerm, category, minPrice, maxPrice, latest);
  };

  return (

    <div style={styles.filterContainer}>
      <input
        type="text"
        placeholder="Search by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={styles.input}
      />
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        style={styles.select}
      >
        {categories.map((cat) => (
          <option key={cat.value} value={cat.value}>
            {cat.label}
          </option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Min Price"
        value={minPrice}
        onChange={(e) => setMinPrice(e.target.value)}
        style={styles.input}
      />
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={(e) => setMaxPrice(e.target.value)}
        style={styles.input}
      />     
      <button onClick={handleSearch} style={styles.button}>
        Search
      </button>
    </div>

  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  } as React.CSSProperties,
  filterContainer: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  } as React.CSSProperties,
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    transition: 'border-color 0.3s',
  } as React.CSSProperties,
  select: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    transition: 'border-color 0.3s',
  } as React.CSSProperties,
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: '#fff',
    cursor: 'pointer',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    transition: 'background-color 0.3s',
  } as React.CSSProperties,
  card: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    width: '300px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
  } as React.CSSProperties,
};


export default observer(MarketSearchBar);

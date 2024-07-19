import React from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';
import { categories, useMarketHandlers } from '../../handlers/marketHandlers';

interface MarketSearchBarProps {
  includeImage: boolean;
  setIncludeImage: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  minPrice: string;
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  maxPrice: string;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
  latest: boolean;
  setLatest: React.Dispatch<React.SetStateAction<boolean>>;
  maxProductsPerPage: number;
}

export const MarketSearchBar: React.FC<MarketSearchBarProps> = observer(({
  includeImage,
  setIncludeImage,
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  latest,
  setLatest,
  maxProductsPerPage
}) => {
  const { fetchFirstProductsPage } = useMarketHandlers();
  const { marketStore } = rootStore;

  const handleSearch = async () => {
    marketStore.clearProducts(); // Clear existing products in the store
    await fetchFirstProductsPage(searchTerm, category, minPrice, maxPrice, latest, maxProductsPerPage); // Fetch products for the first page
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
        <option value="">All Categories</option>
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
      <label>
        <input
          type="checkbox"
          checked={latest}
          onChange={(e) => setLatest(e.target.checked)}
        />
        Latest
      </label>
      <button onClick={handleSearch} style={styles.button}>
        Search
      </button>
      <button onClick={() => setIncludeImage(!includeImage)} style={styles.button}>
        {includeImage ? 'Info Only' : 'Include Image'}
      </button>
    </div>
  );
});

const styles = {
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
    width: '140px'
  } as React.CSSProperties,
};

export default MarketSearchBar;

import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';
import { useMarketHandlers } from '../../handlers/marketHandlers';
import { SingleProductCard } from './SingleProductCard';
import { FakeSingleProductCard } from './FakeSingleProductCar';

interface ProductsContProps {
  includeImage: boolean
  searchTerm: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  latest: boolean;
  pageSize: number;
}

export const ProductsCont: React.FC<ProductsContProps> = observer(({
  includeImage,
  searchTerm,
  category,
  minPrice,
  maxPrice,
  latest,
  pageSize
}) => {
  const { fetchProductsByPage } = useMarketHandlers();
  const { marketStore } = rootStore;

  useEffect(() => {
    if (!marketStore.products || marketStore.products.pages.length === 0) {

      fetchProductsByPage(searchTerm, category, minPrice, maxPrice, latest, pageSize, marketStore.currentPage)
        .catch(error => {
          console.error('Failed to fetch products:', error);
        });
    }
  }, []);

  const handlePageChange = (pageNumber: number) => {

    marketStore.setMarketStoreData('currentPage', pageNumber);
    fetchProductsByPage(searchTerm, category, minPrice, maxPrice, latest, pageSize, pageNumber)
      .catch(error => {
        console.error('Failed to fetch products:', error);
      });
  };

  return (
    <div style={styles.productsContainer}>
      <div style={styles.productsOnlyContainer}>
        {marketStore.loadingState === 'loading' && (
          Array.from({ length: 10 }).map((_, index) => <FakeSingleProductCard key={index} includeImage={includeImage} />)
        )}
        {marketStore.loadingState === 'done' && marketStore.products.pages[marketStore.currentPage - 1].length === 0 && (
          <p>No products found.</p>
        )}
        {marketStore.loadingState === 'done' && marketStore.products.pages[marketStore.currentPage - 1].map(product => (
          <SingleProductCard key={product.id} product={product} includeImage={includeImage} />
        ))}
      </div>
      <div style={styles.paginationContainer}>
        {Array.from({ length: Math.ceil(marketStore.itemsCount / pageSize) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            style={{
              ...styles.paginationButton,
              backgroundColor: marketStore.currentPage === index + 1 ? '#007BFF' : '#fff',
              color: marketStore.currentPage === index + 1 ? '#fff' : '#007BFF',
            }}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
});

const styles = {
  productsContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    padding: '20px',
  } as React.CSSProperties,
  productsOnlyContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '20px',
  } as React.CSSProperties,
  paginationContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  } as React.CSSProperties,
  paginationButton: {
    padding: '10px',
    margin: '0 5px',
    borderRadius: '5px',
    border: '1px solid #007BFF',
    backgroundColor: '#fff',
    color: '#007BFF',
    cursor: 'pointer',
  } as React.CSSProperties,
};

export default ProductsCont;

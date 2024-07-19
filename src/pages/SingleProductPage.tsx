import React, { useEffect, useState } from 'react';
import { productInfosOnly, products } from '../assets/Examples/backEnd';
import { useNavigate, useParams } from 'react-router-dom';
import ProductPageRightCol from '../components/product-page-components/ProductPageRightCol';
import { rootStore } from '../stores/rootStore';
import { useMarketHandlers } from '../handlers/marketHandlers';

const SingleProductPage: React.FC = () => {
  const { whiteBoardStore } = rootStore; // Assuming rootStore is correctly defined elsewhere
  const { fetchProductDetails, copyThisTemplate } = useMarketHandlers();
  const { id } = useParams<{ id: string }>();
  const [productInfoOnly, setProductInfoOnly] = useState<any>(null);
  const [productJsonSpec, setProductJsonSpec] = useState<any>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const productId = parseInt(id, 10);
      fetchProductDetails(productId, setProductInfoOnly, setProductJsonSpec);
    }
  }, [id]);

  useEffect(() => {
    if (productInfoOnly) {
      const importImage = async () => {
        try {
          const image = await import(`../assets/Examples/${productInfoOnly.title}.png`);
          setImageSrc(image.default);
        } catch (error) {
          console.error('Error loading image:', error);
        }
      };

      importImage();
    }
  }, [productInfoOnly]);



  return (
    <div style={styles.container}>
      {productInfoOnly && productJsonSpec && (
        <div style={styles.productDetails}>
          <div style={styles.leftColumn}>
            {imageSrc && <img src={imageSrc} alt="Previous Product" style={styles.image} />}
          </div>
          <ProductPageRightCol
            productInfoOnly={productInfoOnly}
            copyThisTemplate={() => copyThisTemplate(productInfoOnly, productJsonSpec, whiteBoardStore, navigate)}
          />
        </div>
      )}
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
  productDetails: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '20px',
    width: 'fit-content',
    display: 'flex',
  } as React.CSSProperties,
  leftColumn: {
    width: 'fit-content',
    marginRight: '10px',
  } as React.CSSProperties,
  image: {
    maxWidth: '100%',
    height: 'auto',
    borderRadius: '5px',
    marginBottom: '10px',
  } as React.CSSProperties,
};

export default SingleProductPage;

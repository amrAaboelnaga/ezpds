import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';

interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  prevPic: string;
}

interface SingleProductCardProps {
  product: Product;
  includeImage: boolean
}

export const SingleProductCard: React.FC<SingleProductCardProps> = observer(({ product, includeImage }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const importImage = async () => {
      try {
        const image = await import(`../../assets/Examples/Smartwatch.png`);
        setImageSrc(image.default);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    importImage();
  }, [product.title]);

  return (
    <div onClick={() => navigate(`/market/${product.id}`)} style={styles.card}>
      {imageSrc && includeImage && <img style={styles.previewImage} src={imageSrc} alt={product.title} />}
      <h3>{product.title}</h3>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
    </div>
  );
});

const styles = {
  card: {
    backgroundColor: '#f0f0f0',
    padding: '10px',
    borderRadius: '5px',
    width: '400px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    marginBottom: '10px',
    cursor: 'pointer', // Optional: Add cursor pointer for visual feedback
  } as React.CSSProperties,
  previewImage: {
    width: '100%',
    borderRadius: '5px',
  } as React.CSSProperties,
};


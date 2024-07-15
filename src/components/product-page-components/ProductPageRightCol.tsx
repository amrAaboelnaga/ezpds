import React from 'react';

interface ProductPageRightColProps {
  productInfoOnly: any; // Adjust type as per your actual data structure
  useThisTemplate: () => void;
}

const ProductPageRightCol: React.FC<ProductPageRightColProps> = ({
  productInfoOnly,
  useThisTemplate,
}) => {
  return (
    <div style={styles.rightColumn}>
      <h2>{productInfoOnly.title}</h2>
      <p>Price: ${productInfoOnly.price}</p>
      <p>Category: {productInfoOnly.category}</p>
      {/* Add more details as needed */}
      <div style={styles.buttonsContainer}>
        <button
          style={styles.button}
          onClick={() => console.log('Buy this product')}
        >
          Buy this product
        </button>
        <button
          style={styles.button}
          onClick={useThisTemplate}
        >
          Use this template
        </button>
      </div>
    </div>
  );
};

const styles = {
  rightColumn: {
    width: 'fit-content',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  } as React.CSSProperties,
  buttonsContainer: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px',
  } as React.CSSProperties,
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    textAlign: 'center',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  } as React.CSSProperties,
};

export default ProductPageRightCol;

import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

interface FakeSingleProductCardProps {
  includeImage: boolean;
}

export const FakeSingleProductCard: React.FC<FakeSingleProductCardProps> = observer(({ includeImage }) => {
  return (
    <div style={styles.card}>
      {includeImage && <div style={styles.previewImage} />}
      <h3>Loading ..</h3>
      <p>Price: Loading...</p>
      <p>Category: Loading...</p>
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
    height: '537.45px',
    backgroundColor: '#e0e0e0', // Optional: Add a background color for the image placeholder
  } as React.CSSProperties,
};

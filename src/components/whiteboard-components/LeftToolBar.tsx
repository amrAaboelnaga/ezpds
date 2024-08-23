import React from 'react';
import LeftToolBarSingleButton from './LeftToolBarSingleButton';

export function LeftToolBar() {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    itemType: string
  ) => {
    event.dataTransfer.setData('itemType', itemType);
  };

  return (
    <div style={styles.leftToolBarCont}>
      <div style={styles.leftToolBar}>
        {['Text', 'Image', 'List', 'Table', 'Rectangle', 'Circle', 'Triangle'].map(item => (
          <LeftToolBarSingleButton key={item} item={item} onDragStart={handleDragStart} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  leftToolBarCont: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRight: '1px solid #ddd',
    position: 'relative',
    zIndex: 500
  } as React.CSSProperties,
  leftToolBar: {
    position: 'sticky',
    width: '100%',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  } as React.CSSProperties,
};

export default LeftToolBar;

import React from 'react';

export function LeftToolBar() {
  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    itemType: string
  ) => {
    event.dataTransfer.setData('itemType', itemType);
  };

  return (
    <div style={styles.leftToolBarCont}>

      {['Text', 'Image', 'List', 'Table', 'Rectangle', 'Circle', 'Triangle'].map(item => (
        <div
          key={item}
          className='singleLeftButton'
          style={styles.singleLeftButton}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
        >
          {item.charAt(0).toUpperCase() + item.slice(1)}
        </div>
      ))}

    </div>
  );
}

const styles = {
  leftToolBarCont: {
    backgroundColor: '#ffffff',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRight: '1px solid #ddd',
    position: 'sticky',
    top: '100px'
  } as React.CSSProperties,
  singleLeftButton: {
    margin: '15px 0',
    backgroundColor: '#e0e0e0',
    width: '80%',
    padding: '15px',
    borderRadius: '8px',
    cursor: 'grab',
    textAlign: 'center',
    transition: 'background-color 0.3s, transform 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    color: '#333',
  } as React.CSSProperties,
};

export default LeftToolBar;

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
      <div style={styles.leftToolBar}>
        {['Text', 'Image', 'List', 'Table', 'Rectangle', 'Circle', 'Triangle'].map(item => {
          let iconClass = '';

          // Map each item to its corresponding Font Awesome icon class
          switch (item) {
            case 'Text':
              iconClass = 'fa fa-font';
              break;
            case 'Image':
              iconClass = 'fa fa-image';
              break;
            case 'List':
              iconClass = 'fa fa-list';
              break;
            case 'Table':
              iconClass = 'fa fa-table';
              break;
            case 'Rectangle':
              iconClass = 'fa fa-square';
              break;
            case 'Circle':
              iconClass = 'fa fa-circle';
              break;
            case 'Triangle':
              iconClass = 'fa fa-caret-up'; // There isn't a specific triangle icon in Font Awesome; the play icon can represent it.
              break;
            default:
              iconClass = 'fa fa-question'; // Fallback icon
              break;
          }

          return (
            <div
              key={item}
              className='singleLeftButton'
              style={styles.singleLeftButton}
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
            >
              <i className={iconClass}></i> {/* Font Awesome icon */}
            </div>
          );
        })}
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
  } as React.CSSProperties,
  leftToolBar: {
    position: 'sticky',
    width: '100%',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  } as React.CSSProperties,
  singleLeftButton: {
    margin: '20px 0',
    backgroundColor: '#e0e0e0',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'grab',
    textAlign: 'center',
    transition: 'background-color 0.3s, transform 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    color: '#333',
    transform: 'scale(1.5)'
  } as React.CSSProperties,
};

export default LeftToolBar;

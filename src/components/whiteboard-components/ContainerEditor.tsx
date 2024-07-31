import React, { useState } from 'react';
import { ColorSelectorForConts } from './ColorSelectorForConts'; // Update import as needed
import { observer } from 'mobx-react-lite';

interface ContainerEditorProps {
  data: any
}

const ContainerEditor: React.FC<ContainerEditorProps> = ({ data }) => {
  const [showColorBox, setShowColorBox] = useState(false);

  return (
    <div style={styles.editTableCount}>
      {data.done && <button onClick={data.done}>Done</button>}
      {data.colIncrease && <button onClick={data.colIncrease}>Col +</button>}
      {data.colDecrease && <button onClick={data.colDecrease}>Col -</button>}
      {data.rowIncrease && <button onClick={data.rowIncrease}>Row +</button>}
      {data.rowDecrease && <button onClick={data.rowDecrease}>Row -</button>}
      {data.gapIncrease && <button onClick={data.gapIncrease}>VB +</button>}
      {data.gapDecrease && <button onClick={data.gapDecrease}>VB -</button>}
      {data.rowGapIncrease && <button onClick={data.rowGapIncrease}>HB +</button>}
      {data.rowGapDecrease && <button onClick={data.rowGapDecrease}>HB -</button>}
      {data.increaseZIndex && <button onClick={data.increaseZIndex}>↑</button>}
      {data.reduceZIndex && <button onClick={data.reduceZIndex}>↓</button>}
      {data.deleteItem && <button onClick={data.deleteItem}>Delete</button>}
      {data.backgroundColor && <button
        style={{ backgroundColor: data.backgroundColor || 'transparent' }}
        onClick={() => setShowColorBox((prev) => !prev)}
      >.</button>}
      {showColorBox && data.handleBackgroundColorChange && (
        <div style={styles.colorBoxWrapper}>
          <ColorSelectorForConts color={data.backgroundColor || ''} onChange={data.handleBackgroundColorChange} />
        </div>
      )}
    </div>
  );
};

const styles = {
  editTableCount: {
    position: 'absolute', // Adjust based on your needs
    top: '5px', // Adjust based on your needs
    right: '-50px', // Adjust based on your needs
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    zIndex: '900',
    overflow: 'visible'
  } as React.CSSProperties,
  colorBoxWrapper: {
    position: 'absolute',
    right: '100px', // Adjust based on your needs
    top: '0px' // Adjust based on your needs
  } as React.CSSProperties,
};

export default observer(ContainerEditor);

import React, { useState } from 'react';
import { ColorSelectorForConts } from './ColorSelectorForConts'; // Update import as needed
import { observer } from 'mobx-react-lite';
import { DraggableItemInterface } from '../../types/whiteBoard';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';

interface ContainerEditorProps {
  data: any;
  standardSpecs: DraggableItemInterface;
}

const ContainerEditor: React.FC<ContainerEditorProps> = ({ data, standardSpecs }) => {
  const { borderColor, backgroundColor } = standardSpecs;
  const { useUpdateStandards, useEditStandards } = useWhiteBoardHandlers();
  const [showBackgroundColorBox, setShowBackgroundColorBox] = useState(false);
  const [showBorderColorBox, setShowBorderColorBox] = useState(false);
  const updateStandards = useUpdateStandards();
  const editStandards = useEditStandards(data.id, standardSpecs, updateStandards);

  const handleBackgroundColorChange = (color: string) => {
    updateStandards(data.id, undefined, undefined, undefined, undefined, undefined, color);
  };

  const handleBorderColorChange = (color: string) => {
    updateStandards(data.id, undefined, undefined, color, undefined);
  };

  return (
    <div style={styles.container}>
      <div style={styles.editStandardsContainer}>
        <button style={styles.button} onClick={() => editStandards('border', 'increase')}>B +</button>
        <button style={styles.button} onClick={() => editStandards('border', 'decrease')}>B -</button>
        <button style={styles.button} onClick={() => editStandards('padding', 'increase')}>Pad +</button>
        <button style={styles.button} onClick={() => editStandards('padding', 'decrease')}>Pad -</button>
        <button style={styles.button} onClick={() => editStandards('borderRadius', 'increase')}>BR +</button>
        <button style={styles.button} onClick={() => editStandards('borderRadius', 'decrease')}>BR -</button>
        <button style={styles.button} onClick={() => editStandards('opacity', 'decrease')}>OP +</button>
        <button style={styles.button} onClick={() => editStandards('opacity', 'increase')}>OP -</button>
        <button style={styles.button} onClick={() => editStandards('zIndex', 'increase')}>↑</button>
        <button style={styles.button} onClick={() => editStandards('zIndex', 'decrease')}>↓</button>
        {standardSpecs.type !== 'Text' && <button
          style={{ ...styles.button, backgroundColor: backgroundColor || 'transparent', border: `1px solid black` }}
          onClick={() => setShowBackgroundColorBox((prev) => !prev)}
        >.</button>}
        <button
          style={{ ...styles.button, backgroundColor: 'transparent', border: `5px solid ${borderColor}` }}
          onClick={() => setShowBorderColorBox((prev) => !prev)}
        >.</button>
      </div>
      <div style={{ height: '0px' }} />
      <div style={styles.actionButtonsContainer}>
        {data.colIncrease && <button style={styles.button} onClick={data.colIncrease}>Col +</button>}
        {data.colDecrease && <button style={styles.button} onClick={data.colDecrease}>Col -</button>}
        {data.rowIncrease && <button style={styles.button} onClick={data.rowIncrease}>Row +</button>}
        {data.rowDecrease && <button style={styles.button} onClick={data.rowDecrease}>Row -</button>}
        {data.gapIncrease && <button style={styles.button} onClick={data.gapIncrease}>VB +</button>}
        {data.gapDecrease && <button style={styles.button} onClick={data.gapDecrease}>VB -</button>}
        {data.rowGapIncrease && <button style={styles.button} onClick={data.rowGapIncrease}>HB +</button>}
        {data.rowGapDecrease && <button style={styles.button} onClick={data.rowGapDecrease}>HB -</button>}
        {data.addImg && <button style={styles.button} onClick={data.addImg}>Add Image</button>}
      </div>
      <div style={{ height: '0px' }} />
      <div style={styles.editStandardsContainer}>
        {/*data.done && <button style={styles.button} onClick={data.done}>Done</button>*/}
        {data.deleteItem && <button style={{ ...styles.button, color: 'red', width: "60px" }} onClick={data.deleteItem}>Delete</button>}
      </div>
      {showBorderColorBox && (
        <div style={styles.colorBoxWrapper}>
          <ColorSelectorForConts color={borderColor} onChange={handleBorderColorChange} setShow={setShowBorderColorBox} />
        </div>
      )}
      {showBackgroundColorBox && (
        <div style={styles.colorBoxWrapper}>
          <ColorSelectorForConts color={backgroundColor} onChange={handleBackgroundColorChange} setShow={setShowBackgroundColorBox} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'absolute',
    top: '5px',
    right: '-220px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: '900',
    overflow: 'visible',
    width: '200px',
    backgroundColor: 'grey',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 0px',
    borderRadius: '8px'

  } as React.CSSProperties,
  editStandardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
    justifyContent: 'center'
  } as React.CSSProperties,
  actionButtonsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
    justifyContent: 'center'
  } as React.CSSProperties,
  button: {
    width: '30px',
    height: '30px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    fontSize: '10px',
    fontWeight: 'bold',
    color: '#333',
    padding: '0',
  } as React.CSSProperties,
  colorBoxWrapper: {
    position: 'absolute',
    right: '70px',
    top: '0px',
    zIndex: '1000',
  } as React.CSSProperties,
};

export default observer(ContainerEditor);

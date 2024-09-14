import React, { useEffect, useState } from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";
import { LeftToolBar } from './LeftToolBar';
import { TextEditorBar } from './TextEditorBar';
import WBPage from './WBPage';
import RightDrawer from './RightDrawer';
import PageModifiers from './PageModifiers';
import TextPageModifiers from './TextPageModifiers';
import { reaction } from 'mobx';

const CreateOrEditCont: React.FC = observer(() => {
  const [isMouseDown, setIsMouseDown] = useState(false)

  const { whiteBoardStore } = rootStore;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {

      const isCtrlPressed = e.ctrlKey || e.metaKey;

      if (isCtrlPressed && e.key === 'z') {
        console.log('Undo triggered');
        e.preventDefault();
        whiteBoardStore.undo();
      } else if (isCtrlPressed && e.key === 'y') {
        e.preventDefault();
        whiteBoardStore.redo();
      } else {
        whiteBoardStore.saveCurrentState();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);


  useEffect(() => {
    const disposer = reaction(
      () => whiteBoardStore.pages.slice(),
      () => {
        if (!isMouseDown) {
          whiteBoardStore.saveCurrentState();
        } else {
          console.log('Mouse is down, don\'t save minor changes');
        }
      }
    );

    return () => disposer();
  }, [isMouseDown]);


  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);

    const handleMouseUp = () => {
      setIsMouseDown(false);
      whiteBoardStore.saveCurrentState();
    };

    const handleMouseClick = () => {
      whiteBoardStore.saveCurrentState();
    };

  
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('click', handleMouseClick);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('click', handleMouseClick);
    };
  }, []);

  return (
    <div style={{ ...styles.createOrEditCont }}>
      <LeftToolBar />

      <div style={styles.editTableCount}>
        {(whiteBoardStore.textContent && whiteBoardStore.textOnChange) && (< TextEditorBar content={whiteBoardStore.textContent} onChange={whiteBoardStore.textOnChange} />)}
      </div>
      <div style={styles.workSpaceCont}>
        <TextPageModifiers />
        <PageModifiers />
        {whiteBoardStore.pages.map((page, index) => (
          <WBPage key={index} index={index} />
        ))}
      </div>
      <RightDrawer />
    </div>
  );
});

const styles = {
  createOrEditCont: {
    display: 'grid',
    gridTemplateColumns: '100px auto',
  } as React.CSSProperties,
  workSpaceCont: {
    paddingTop: '20px',
    backgroundColor: 'rgb(214, 214, 214)',
    position: 'relative',
    height: '100%',
    marginBottom: '50px'
  } as React.CSSProperties,
  workSpaceFile: {
    width: '210mm',
    height: '297mm',
    backgroundColor: 'white',
    margin: '60px auto',
    position: 'relative',
  } as React.CSSProperties,
  editTableCount: {
    position: 'absolute',
    right: '-60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  } as React.CSSProperties,
};

export default CreateOrEditCont;

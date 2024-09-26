import React, { useEffect, useState, useRef } from 'react';
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
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isExporting, setIsExporting] = useState(false)
  const { whiteBoardStore } = rootStore;

  // Refs for each page
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const updatePageRefs = () => {
    if (pageRefs.current.length > 0) {
      whiteBoardStore.setPageRefs(pageRefs.current);    
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrlPressed = e.ctrlKey || e.metaKey;
      if (isCtrlPressed && e.key === 'z') {
        e.preventDefault();
        whiteBoardStore.undo();
      } else if (isCtrlPressed && e.key === 'y') {
        e.preventDefault();
        whiteBoardStore.redo();
      } else {
        whiteBoardStore.saveCurrentState();
        updatePageRefs()
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [whiteBoardStore]);

  useEffect(() => {
    const disposer = reaction(
      () => whiteBoardStore.pages.slice(),
      () => {
        if (!isMouseDown) {
          whiteBoardStore.saveCurrentState();
          updatePageRefs()
        }
      }
    );
    return () => disposer();
  }, [isMouseDown, whiteBoardStore]);

  useEffect(() => {
    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => {
      setIsMouseDown(false);
      whiteBoardStore.saveCurrentState();
      updatePageRefs()
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [whiteBoardStore]);


  return (
    <div style={styles.createOrEditCont}>
      {isExporting &&
        <div style={styles.generating} >
          <img style={{ width: '150px' }} src="https://i.gifer.com/ZKZg.gif" alt="Loading..." />
        </div>
      }
      <LeftToolBar />
      <div style={styles.editTableCount}>
        {whiteBoardStore.textContent && whiteBoardStore.textOnChange && (
          <TextEditorBar content={whiteBoardStore.textContent} onChange={whiteBoardStore.textOnChange} />
        )}
      </div>
      <div style={styles.workSpaceCont}>
        <TextPageModifiers />
        <PageModifiers />
        {whiteBoardStore.pages.map((page, index) => (
          <div className="print-container" style={styles.workSpaceContParent} key={index} ref={(el) => pageRefs.current[index] = el}>
            <WBPage index={index} isExporting={isExporting} setIsExporting={setIsExporting} />
          </div>
        ))}
      </div>
      <RightDrawer isExporting={isExporting} setIsExporting={setIsExporting} />
    </div>
  );
});

const styles = {
  generating: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '0px',
    left: '5%',
    zIndex: 300
  } as React.CSSProperties,
  workSpaceContParent: {
    backgroundColor: 'white',
    width: '210mm',
    height: '297mm',
    position: 'relative',
    marginBottom: '150px'
  } as React.CSSProperties,
  createOrEditCont: {
    display: 'grid',
    gridTemplateColumns: '100px auto',
  } as React.CSSProperties,
  workSpaceCont: {
    paddingTop: '20px',
    backgroundColor: 'rgb(214, 214, 214)',
    position: 'relative',
    height: '100%',
    marginBottom: '50px',
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

import React, { useRef } from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { LeftToolBar } from './LeftToolBar';
import { DraggableItem } from './DraggableItem';
import ExportAndImport from './ExportAndImport';
import ProductInfoBox from './productInfoBox';
import { TextEditorBar } from './TextEditorBar';
import ContainerEditor from './ContainerEditor';
import PageGuids from './PageGuids';
import RulerComponent from './RulerComponent';
import WBPage from './WBPage';
import RightDrawer from './RightDrawer';
import PageModifiers from './PageModifiers';
import TextPageModifiers from './TextPageModifiers';
//import ExportAndImport from './ExportAndImport/ExportAndImport';

const CreateOrEditCont: React.FC = observer(() => {
  const { whiteBoardStore } = rootStore;
  const { useHandleDrop, useHandleDragOver, useToggleEditing } = useWhiteBoardHandlers();
  const page = useRef<HTMLDivElement>(null);
  const handleDrop = useHandleDrop();
  const handleDragOver = useHandleDragOver();
  const toggleEditing = useToggleEditing();

  return (
    <div style={{ ...styles.createOrEditCont }}>
      <LeftToolBar />

      <div style={styles.editTableCount}>
        {(whiteBoardStore.textContent && whiteBoardStore.textOnChange) && (< TextEditorBar content={whiteBoardStore.textContent} onChange={whiteBoardStore.textOnChange} />)}
      </div>
      <div style={styles.workSpaceCont}>
        <PageModifiers />
        <TextPageModifiers />
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

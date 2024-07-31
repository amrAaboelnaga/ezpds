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
//import ExportAndImport from './ExportAndImport/ExportAndImport';

const CreateOrEditCont: React.FC = observer(() => {
  const { whiteBoardStore } = rootStore;
  const { useHandleDrop, useHandleDragOver, useToggleEditing } = useWhiteBoardHandlers();
  const page = useRef<HTMLDivElement>(null);
  const handleDrop = useHandleDrop();
  const handleDragOver = useHandleDragOver();
  const toggleEditing = useToggleEditing();
  try {
    console.log(whiteBoardStore.jsonSpecs[whiteBoardStore.containerEditor.id].location.y)
  } catch (e) {

  }
  return (
    <div style={{ ...styles.createOrEditCont, userSelect: 'none' }}>
      <LeftToolBar />
      <div style={styles.editTableCount}>
        {(whiteBoardStore.textContent && whiteBoardStore.textOnChange) && (< TextEditorBar content={whiteBoardStore.textContent} onChange={whiteBoardStore.textOnChange} />)}
      </div>
      <div style={styles.workSpaceCont}>
        <div ref={page} style={styles.workSpaceFile} onDrop={handleDrop} onDragOver={handleDragOver} >
          {(whiteBoardStore.containerEditor) && (
            <div
              id="ContainerEditor"
              style={{
                position: 'absolute',
                top: (whiteBoardStore.jsonSpecs[whiteBoardStore.containerEditor.id].location.y),
                left: `calc(${whiteBoardStore.jsonSpecs[whiteBoardStore.containerEditor.id].location.x}px + ${whiteBoardStore.jsonSpecs[whiteBoardStore.containerEditor.id].width} + 10px)`,
                height: whiteBoardStore.jsonSpecs[whiteBoardStore.containerEditor.id].height,

              }}>
              <ContainerEditor
                data={whiteBoardStore.containerEditor}
              />
            </div>
          )}
          {Object.keys(whiteBoardStore.jsonSpecs).map((id) => (
            <DraggableItem
              key={id}
              id={id}
              itemSpecs={whiteBoardStore.jsonSpecs[id]}
              toggleEditing={toggleEditing}
            />
          ))}
        </div>
      </div>
      {<ExportAndImport page={page} />}
      <ProductInfoBox />
    </div>
  );
});

const styles = {
  createOrEditCont: {
    display: 'grid',
    gridTemplateColumns: '15% 85%',
  } as React.CSSProperties,
  workSpaceCont: {
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

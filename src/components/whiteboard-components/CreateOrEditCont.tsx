import React, { useRef } from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { LeftToolBar } from './LeftToolBar';
import { DraggableItem } from './DraggableItem';
import ExportAndImport from './ExportAndImport';
import ProductInfoBox from './productInfoBox';
//import ExportAndImport from './ExportAndImport/ExportAndImport';

const CreateOrEditCont: React.FC = observer(() => {
  const { whiteBoardStore } = rootStore;
  const { useHandleDrop, useHandleDragOver, useToggleEditing } = useWhiteBoardHandlers();
  const page = useRef<HTMLDivElement>(null);
  const handleDrop = useHandleDrop();
  const handleDragOver = useHandleDragOver();
  const toggleEditing = useToggleEditing();

  return (
    <div style={styles.createOrEditCont}>
      <LeftToolBar />
      <div style={styles.workSpaceCont}>
        <div ref={page} style={styles.workSpaceFile} onDrop={handleDrop} onDragOver={handleDragOver} >
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
    height: '100%',
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '15% 85%',
    overflow: 'scroll',
    overflowX: 'hidden'
  } as React.CSSProperties,
  workSpaceCont: {
    backgroundColor: 'rgb(214, 214, 214)',
    position: 'relative',
    height: '100%',
    marginBottom: '100px'
  } as React.CSSProperties,
  workSpaceFile: {
    width: '210mm',
    height: '297mm',
    backgroundColor: 'white',
    margin: '30px auto',
    position: 'relative',
  } as React.CSSProperties,
};

export default CreateOrEditCont;

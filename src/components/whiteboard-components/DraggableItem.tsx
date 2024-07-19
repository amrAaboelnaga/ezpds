import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { ResizeBox } from './ResizeBox';
import { DraggableTitle } from './DraggableChilds/DraggableTitle';
import { DraggableSubTitle } from './DraggableChilds/DraggableSubTitle';
import { DraggableSmallText } from './DraggableChilds/DraggableSmallText';
import { DraggableImage } from './DraggableChilds/DraggableImage';
import { DraggableTable } from './DraggableChilds/DraggableTable';
import { DraggableList } from './DraggableChilds/DraggableList';
import { rootStore } from '../../stores/rootStore';

interface DraggableItemProps {
  id: string;
  itemSpecs: {
    type: string;
    content: string;
    location: { x: number; y: number };
    width: number;
    height: number;
    isEditing: boolean;
    imgData: string;
    rows?: number;
    columns?: number;
    tableData?: string[][];
    listData?: string[];
  };
  toggleEditing: (id: string) => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = observer(({ id, itemSpecs, toggleEditing }) => {
  const { whiteBoardStore } = rootStore;
  const { useResizeState, useHandleMouseDownReposition, useHandleMouseDownResize, useHandleMouseMove, useHandleMouseUp } = useWhiteBoardHandlers();
  const [jsonSpecs, setJsonSpecs] = useState(whiteBoardStore.jsonSpecs)
  const { resizeState, setResizeState } = useResizeState({
    resizing: false,
    direction: '',
    initialMouseX: 0,
    initialMouseY: 0,
    initialWidth: 0,
    initialHeight: 0,
  });

  const handleMouseDownReposition = useHandleMouseDownReposition(jsonSpecs, setJsonSpecs);
  const handleMouseDownResize = useHandleMouseDownResize(jsonSpecs, id, setResizeState);
  const handleMouseMove = useHandleMouseMove(jsonSpecs, id, resizeState, setJsonSpecs);
  const handleMouseUp = useHandleMouseUp(setResizeState);

  useEffect(() => {
    setJsonSpecs(whiteBoardStore.jsonSpecs)
  }, [whiteBoardStore.jsonSpecs]);

  useEffect(() => {
    whiteBoardStore.setJsonSpecs(jsonSpecs)
  }, [jsonSpecs]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeState]);


  return (
    <div
      style={{
        ...styles.draggableItem,
        ...itemSpecs.isEditing && styles.editing,
        left: `${itemSpecs.location.x}px`,
        top: `${itemSpecs.location.y}px`,
        width: `${itemSpecs.width}px`,
        height: `${itemSpecs.height}px`,
      }}
      onDoubleClick={itemSpecs.isEditing === false ? () => toggleEditing(id) : undefined}
      onMouseDown={(e) => handleMouseDownReposition(e, id)}
    >
      {itemSpecs.type === 'title' && <DraggableTitle id={id} content={itemSpecs.content} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} />}
      {itemSpecs.type === 'subtitle' && <DraggableSubTitle id={id} content={itemSpecs.content} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} />}
      {itemSpecs.type === 'smallText' && <DraggableSmallText id={id} content={itemSpecs.content} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} />}
      {itemSpecs.type === 'image' && <DraggableImage id={id} imgData={itemSpecs.imgData} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} />}
      {itemSpecs.type === 'table' && <DraggableTable id={id} rows={itemSpecs.rows!} columns={itemSpecs.columns!} tableData={itemSpecs.tableData!} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} />}
      {itemSpecs.type === 'list' && <DraggableList id={id} listData={itemSpecs.listData!} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} />}
      {itemSpecs.isEditing && <ResizeBox handleMouseDownResize={handleMouseDownResize} />}
    </div>
  );
});


const styles = {
  draggableItem: {
    display: 'flex',
    position: 'absolute',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    left: 0,
    top: 0,
  } as React.CSSProperties,
  editing: {
    border: '1px solid #000',
    backgroundColor: 'rgb(240, 240, 240)',
  } as React.CSSProperties,
};

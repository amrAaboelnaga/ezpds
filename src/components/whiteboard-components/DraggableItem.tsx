import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { ResizeBox } from './ResizeBox';
import { rootStore } from '../../stores/rootStore';
import { DraggableText } from './DraggableChilds/DraggableText';
import { DraggableList } from './DraggableChilds/DraggableList';
import { DraggableItemInterface, DraggableTextInterface, DraggableListInterface, DraggableImageInterface, DraggableTableInterface } from '../../types/whiteBoard';
import { DraggableTable } from './DraggableChilds/DraggableTable';

interface DraggableItemProps {
  id: string;
  itemSpecs: DraggableItemInterface;
  toggleEditing: (id: string) => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = observer(({ id, itemSpecs, toggleEditing }) => {
  const [focusedIndexTable, setFocusedIndexTable] = useState<{ row: number, col: number } | null>(null);
  const [focusedIndexList, setFocusedIndexList] = useState<number | null>(null);
  const [topTextBarHelper, setTopTextBarHelper] = useState(null)
  const draggableRef = useRef<HTMLDivElement>(null);
  const { whiteBoardStore } = rootStore;
  const { useResizeState, useHandleBlur, useHandleMouseDownReposition, useHandleMouseDownResize, useHandleMouseMove, useHandleMouseUp } = useWhiteBoardHandlers();
  const [jsonSpecs, setJsonSpecs] = useState(whiteBoardStore.jsonSpecs);
  const { resizeState, setResizeState } = useResizeState({
    resizing: false,
    direction: '',
    initialMouseX: 0,
    initialMouseY: 0,
    initialWidth: 0,
    initialHeight: 0,
  });

  const handleMouseDownReposition = useHandleMouseDownReposition();
  const handleMouseDownResize = useHandleMouseDownResize(jsonSpecs, id, setResizeState);
  const handleMouseMove = useHandleMouseMove(jsonSpecs, id, resizeState, setJsonSpecs);
  const handleMouseUp = useHandleMouseUp(setResizeState);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      const textEditorBarElement = document.getElementById('TextEditorBar');
      const containerEditorElement = document.getElementById('ContainerEditor');

      if ((textEditorBarElement && textEditorBarElement.contains(event.target as Node)) || (containerEditorElement && containerEditorElement.contains(event.target as Node))) {

      } else if (draggableRef.current && !draggableRef.current.contains(event.target as Node)) {
        if (focusedIndexList || focusedIndexTable) {
          setFocusedIndexList(null);
          setFocusedIndexTable(null);
        } else if (itemSpecs.isEditing === true) {
          toggleEditing(id);
        }
      }
    };

    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const clickEvent = isTouchDevice ? 'touchstart' : 'mousedown';

    document.addEventListener(clickEvent, handleOutsideClick);

    return () => {
      document.removeEventListener(clickEvent, handleOutsideClick);
    };
  }, [draggableRef, toggleEditing, focusedIndexList, focusedIndexTable, itemSpecs, id]);




  // Catch block can be added here if needed


  useEffect(() => {
    setJsonSpecs(whiteBoardStore.jsonSpecs);
  }, [handleMouseMove]);

  useEffect(() => {
    whiteBoardStore.setJsonSpecs(jsonSpecs);
  }, [jsonSpecs]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizeState]);

  const renderContent = () => {
    switch (itemSpecs.type) {
      case 'Text':
        const textSpecs = itemSpecs as DraggableTextInterface;
        return <DraggableText id={id} content={textSpecs.data} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} zIndex={textSpecs.zIndex} />;
      case 'List':
        const listSpecs = itemSpecs as DraggableListInterface;
        return <DraggableList id={id} listData={listSpecs.data} gap={listSpecs.gap} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} backgroundColor={itemSpecs.backgroundColor} zIndex={itemSpecs.zIndex} focusedIndex={focusedIndexList} setFocusedIndex={setFocusedIndexList} />;
      // case 'Image':
      //   const imageSpecs = itemSpecs as DraggableImageInterface;
      //   return <DraggableImage id={id} src={imageSpecs.src} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} />;
      case 'Table':
        const tableSpecs = itemSpecs as DraggableTableInterface;
        return <DraggableTable id={id} rows={tableSpecs.rows} columns={tableSpecs.columns} rowGap={tableSpecs.rowGap} columnGap={tableSpecs.columnGap} tableData={tableSpecs.data} isEditing={itemSpecs.isEditing} toggleEditing={toggleEditing} backgroundColor={itemSpecs.backgroundColor} zIndex={itemSpecs.zIndex} focusedIndex={focusedIndexTable} setFocusedIndex={setFocusedIndexTable} cellDimensionsStore={tableSpecs.cellDimensions} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={draggableRef}
      style={{
        ...styles.draggableItem,
        ...itemSpecs.isEditing && styles.editing,
        left: `${itemSpecs.location.x}px`,
        top: `${itemSpecs.location.y}px`,
        width: itemSpecs.width,
        height: itemSpecs.height,
        zIndex: itemSpecs.zIndex
      }}
      onDoubleClick={itemSpecs.isEditing === false ? () => toggleEditing(id) : undefined}
      onMouseDown={(e) => handleMouseDownReposition(e, id)}
    >
      {renderContent()}
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
    padding: '0px'
  } as React.CSSProperties,
  editing: {
    border: '1px solid #000',
    backgroundColor: 'rgb(240, 240, 240)',
  } as React.CSSProperties,
};

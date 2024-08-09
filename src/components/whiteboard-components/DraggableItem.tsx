import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { ResizeBox } from './ResizeBox';
import { rootStore } from '../../stores/rootStore';
import { DraggableText } from './DraggableChilds/DraggableText';
import { DraggableList } from './DraggableChilds/DraggableList';
import { DraggableItemInterface, DraggableTextInterface, DraggableListInterface, DraggableImageInterface, DraggableTableInterface, DraggableCircleInterface, DraggableTriangleInterface } from '../../types/whiteBoard';
import { DraggableTable } from './DraggableChilds/DraggableTable';
import { DraggableImage } from './DraggableChilds/DraggableImage';
import { DraggableTriangle } from './DraggableChilds/DraggableTriangle';

interface DraggableItemProps {
  id: string;
  itemSpecs: DraggableItemInterface;
  toggleEditing: (id: string) => void;
}

export const DraggableItem: React.FC<DraggableItemProps> = observer(({ id, itemSpecs, toggleEditing }) => {
  const [focusedIndexTable, setFocusedIndexTable] = useState<{ row: number, col: number } | null>(null);
  const [focusedIndexList, setFocusedIndexList] = useState<number | null>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const { useHandleMouseDownReposition, } = useWhiteBoardHandlers();

  const handleMouseDownReposition = useHandleMouseDownReposition();

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


  const renderContent = () => {
    switch (itemSpecs.type) {
      case 'Text':
        const textSpecs = itemSpecs as DraggableTextInterface;
        return <DraggableText id={id} standardSpecs={textSpecs} content={textSpecs.data} toggleEditing={toggleEditing} />;
      case 'Rectangle':
        const rectangleSpecs = itemSpecs as DraggableTextInterface;
        return <DraggableText id={id} standardSpecs={rectangleSpecs} content={rectangleSpecs.data} toggleEditing={toggleEditing} />;
      case 'Circle':
        const circleSpecs = itemSpecs as DraggableCircleInterface;
        return <DraggableText id={id} standardSpecs={circleSpecs} content={circleSpecs.data} toggleEditing={toggleEditing} />;
      case 'Triangle':
        const triangleSpecs = itemSpecs as DraggableTriangleInterface;
        return <DraggableTriangle id={id} standardSpecs={triangleSpecs} content={triangleSpecs.data} toggleEditing={toggleEditing} />;
      case 'List':
        const listSpecs = itemSpecs as DraggableListInterface;
        return <DraggableList id={id} standardSpecs={listSpecs} listData={listSpecs.data} toggleEditing={toggleEditing} focusedIndex={focusedIndexList} setFocusedIndex={setFocusedIndexList} draggableRef={draggableRef} />;
      case 'Image':
        const imageSpecs = itemSpecs as DraggableImageInterface;
        return <DraggableImage id={id} standardSpecs={imageSpecs} toggleEditing={toggleEditing} />;
      case 'Table':
        const tableSpecs = itemSpecs as DraggableTableInterface;
        return <DraggableTable id={id} standardSpecs={tableSpecs} tableData={tableSpecs.data} toggleEditing={toggleEditing} focusedIndex={focusedIndexTable} setFocusedIndex={setFocusedIndexTable} cellDimensionsStore={tableSpecs.cellDimensions} />;
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
        opacity: itemSpecs.opacity,
        left: `${itemSpecs.location.x}px`,
        top: `${itemSpecs.location.y}px`,
        width: itemSpecs.width,
        height: itemSpecs.height,
        zIndex: itemSpecs.zIndex,
        transform: `rotate(${itemSpecs.rotation}deg)`
      }}
      onDoubleClick={itemSpecs.isEditing === false ? () => toggleEditing(id) : undefined}
      onMouseDown={(e) => handleMouseDownReposition(e, id, draggableRef)}
    >
      {renderContent()}
      {itemSpecs.isEditing && <ResizeBox id={id} draggableRef={draggableRef} />}
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
  } as React.CSSProperties,
};

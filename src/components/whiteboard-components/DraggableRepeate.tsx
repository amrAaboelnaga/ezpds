import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { ResizeBox } from './ResizeBox';
import { rootStore } from '../../stores/rootStore';
import { DraggableText } from './DraggableChilds/DraggableText';
import { DraggableList } from './DraggableChilds/DraggableList';
import { DraggableItemInterface, DraggableTextInterface, DraggableListInterface, DraggableImageInterface, DraggableTableInterface, DraggableCircleInterface, DraggableTriangleInterface, DraggablePageNumberInterface } from '../../types/whiteBoard';
import { DraggableTable } from './DraggableChilds/DraggableTable';
import { DraggableImage } from './DraggableChilds/DraggableImage';
import { DraggableTriangle } from './DraggableChilds/DraggableTriangle';

interface DraggableRepeateProps {
  id: string;
  itemSpecs: DraggableItemInterface;
  toggleEditing: (pageId: number, id: string) => void;
  pageId: number
  inMini?: boolean
}

export const DraggableRepeate: React.FC<DraggableRepeateProps> = observer(({ id, itemSpecs, toggleEditing, pageId, inMini }) => {
  const [focusedIndexTable, setFocusedIndexTable] = useState<{ row: number, col: number } | null>(null);
  const [focusedIndexList, setFocusedIndexList] = useState<number | null>(null);
  const draggableRef = useRef<HTMLDivElement>(null);
  const { useHandleMouseDownReposition, } = useWhiteBoardHandlers();
  const { whiteBoardStore } = rootStore;

  const handleMouseDownReposition = useHandleMouseDownReposition();

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
      if (inMini) return
      const textEditorBarElement = document.getElementById('TextEditorBar');
      const containerEditorElement = document.getElementById('ContainerEditor');

      if ((textEditorBarElement && textEditorBarElement.contains(event.target as Node)) || (containerEditorElement && containerEditorElement.contains(event.target as Node))) {

      } else if (draggableRef.current && !draggableRef.current.contains(event.target as Node)) {
        if (focusedIndexList || focusedIndexTable) {
          setFocusedIndexList(null);
          setFocusedIndexTable(null);
        } else if (itemSpecs.isEditing === true) {
          toggleEditing(pageId, id);
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
        return <DraggableText id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTextInterface} content={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTextInterface).data} toggleEditing={toggleEditing} pageId={0} />;
      case 'Rectangle':
        return <DraggableText id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTextInterface} content={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTextInterface).data} toggleEditing={toggleEditing} pageId={0} />;
      case 'Circle':
        return <DraggableText id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggableCircleInterface} content={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggableCircleInterface).data} toggleEditing={toggleEditing} pageId={0} />;
      case 'Triangle':
        return <DraggableTriangle id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTriangleInterface} content={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTriangleInterface).data} toggleEditing={toggleEditing} pageId={0} />;
      case 'List':
        return <DraggableList id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggableListInterface} listData={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggableListInterface).data} toggleEditing={toggleEditing} focusedIndex={focusedIndexList} setFocusedIndex={setFocusedIndexList} draggableRef={draggableRef} pageId={0} />;
      case 'Image':
        return <DraggableImage id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggableImageInterface} toggleEditing={toggleEditing} pageId={pageId} />;
      case 'Table':
        return <DraggableTable id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTableInterface} tableData={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTableInterface).data} toggleEditing={toggleEditing} focusedIndex={focusedIndexTable} setFocusedIndex={setFocusedIndexTable} cellDimensionsStore={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggableTableInterface).cellDimensions} pageId={0} />;
      case 'PageNumber':
        if (whiteBoardStore.showPageNumber === true) {
          return <DraggableText id={id} standardSpecs={whiteBoardStore.pages[0].jsonSpecs[id] as DraggablePageNumberInterface} content={(whiteBoardStore.pages[0].jsonSpecs[id] as DraggablePageNumberInterface).data} toggleEditing={toggleEditing} pageId={0} pageNumbHelper={pageId + 1} />;
        } else {
          return null
        }
      default:
        return null;
    }
  };

  if (!whiteBoardStore.pages[0].jsonSpecs[id]) return null

  return (
    <div
      ref={draggableRef}
      style={{
        ...styles.draggableItem,
        ...whiteBoardStore.pages[0].jsonSpecs[id].isEditing && styles.editing,
        opacity: whiteBoardStore.pages[0].jsonSpecs[id].opacity,
        left: `${whiteBoardStore.pages[0].jsonSpecs[id].location.x}px`,
        top: `${whiteBoardStore.pages[0].jsonSpecs[id].location.y}px`,
        width: whiteBoardStore.pages[0].jsonSpecs[id].width,
        height: whiteBoardStore.pages[0].jsonSpecs[id].height,
        zIndex: whiteBoardStore.pages[0].jsonSpecs[id].zIndex,
        transform: `rotate(${whiteBoardStore.pages[0].jsonSpecs[id].rotation}deg)`
      }}
      onDoubleClick={whiteBoardStore.pages[0].jsonSpecs[id].isEditing === false ? () => toggleEditing(0, id) : undefined}
      onMouseDown={(e) => handleMouseDownReposition(e, id, draggableRef, 0)}
    >
      {renderContent()}
      {itemSpecs.isEditing && <ResizeBox id={id} draggableRef={draggableRef} pageId={0} />}
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

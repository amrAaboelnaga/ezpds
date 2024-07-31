import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { whiteBoardStore } from '../../../stores/whiteBoardStore';
import { TextEditorBar } from '../TextEditorBar';
import { EditableText } from '../EditableText';
import { Text } from '../../../types/whiteBoard';

interface DraggableTextProps {
  id: string;
  content: Text;
  isEditing: boolean;
  toggleEditing: (id: string) => void;
  zIndex: number
}

export const DraggableText: React.FC<DraggableTextProps> = observer(({ id, content, isEditing, toggleEditing, zIndex }) => {
  const { useHandleContainerEditorBar, useHandleTextEdit, useZIndexHandler, useHandleBlur, useHandleKeyDown, useDeleteItem, useHandleTopTextBar } = useWhiteBoardHandlers();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const textEditorBarRef = useRef<HTMLDivElement>(null);
  const handleZindex = useZIndexHandler();
  const handleTextEdit = useHandleTextEdit();
  const handleBlur = useHandleBlur();
  const handleKeyDown = useHandleKeyDown(handleBlur);
  const handleDeleteItem = useDeleteItem();
  const handleTopTextBar = useHandleTopTextBar();
  const handleContainerEditor = useHandleContainerEditorBar();

  const handleChange = (updatedContent: Partial<Text>, newZIndex?: number) => {
    for (const [key, value] of Object.entries(updatedContent)) {
      const event = {
        target: { name: key, value } as EventTarget & HTMLTextAreaElement,
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleTextEdit(id, event);
    }
  };

  const increaseZIndex = () => {
    const newZIndex = zIndex + 1
    handleZindex(id, newZIndex)
  };

  const reduceZIndex = () => {
    const newZIndex = zIndex - 1
    handleZindex(id, newZIndex)
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = content.fontSize;
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, content]);


  useEffect(() => {
    handleTopTextBar(isEditing, content, handleChange)
    handleContainerEditor(isEditing, { done: () => toggleEditing(id), colIncrease: undefined, colDecrease: undefined, rowIncrease: undefined, rowDecrease: undefined, gapIncrease: undefined, gapDecrease: undefined, rowGapIncrease: undefined, rowGapDecrease: undefined, increaseZIndex, reduceZIndex, deleteItem: () => handleDeleteItem(id), toggleColorBox: undefined, handleBackgroundColorChange: undefined, backgroundColor: undefined, id });
  }, [isEditing, content])

  return (
    <div style={{
      ...styles.draggableChildCont, backgroundColor: content.backgroundColor, padding: isEditing ? '0px' : '1px'
    }}>
      <EditableText
        textData={content}
        isEditing={isEditing}
        onChange={(newValue) => {
          handleTextEdit(id, undefined, undefined, newValue)
        }}
        onFocus={() => { }}
        onBlur={() => { }}
      />
    </div>
  );
});

const styles = {
  draggableChildCont: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
  editTableCount: {
    position: 'absolute',
    right: '-60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  } as React.CSSProperties,
  text: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent'
  } as React.CSSProperties,
  textareaStyle: {
    padding: '0px',
    width: '100%',
    border: 'none',
    outline: 'none',
    resize: 'none', // Disables the resize handle but allows resizing programmatically
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // Ensures the text stays within the textarea
    boxSizing: 'border-box', // Includes padding in the element's total width and height
    backgroundColor: 'transparent'
  } as React.CSSProperties,
};

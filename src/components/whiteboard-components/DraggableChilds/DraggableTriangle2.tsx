import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { whiteBoardStore } from '../../../stores/whiteBoardStore';
import { TextEditorBar } from '../TextEditorBar';
import { EditableText } from '../EditableText';
import { DraggableTextInterface, Text, DraggableRectangleInterface, DraggableCircleInterface, DraggableTriangleInterface } from '../../../types/whiteBoard';

interface DraggableTriangleProps {
  id: string;
  standardSpecs: DraggableTriangleInterface;
  content: Text;
  toggleEditing: (pageId: number, id: string) => void;
  pageId: number
}

export const DraggableTriangle: React.FC<DraggableTriangleProps> = observer(({ pageId, id, standardSpecs, content, toggleEditing }) => {
  const { isEditing, border, borderColor, borderRadius, zIndex } = standardSpecs
  const { useHandleContainerEditorBar, useHandleTextEdit, useZIndexHandler, useHandleBlur, useHandleKeyDown, useDeleteItem, useHandleTopTextBar } = useWhiteBoardHandlers();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleTextEdit = useHandleTextEdit();
  const handleBlur = useHandleBlur();
  const handleKeyDown = useHandleKeyDown(handleBlur);
  const handleDeleteItem = useDeleteItem();
  const handleTopTextBar = useHandleTopTextBar();
  const handleContainerEditor = useHandleContainerEditorBar();
  const grandParentTriangleRef = useRef<HTMLDivElement>(null);

  const handleChange = (updatedContent: Partial<Text>, newZIndex?: number) => {
    for (const [key, value] of Object.entries(updatedContent)) {
      const event = {
        target: { name: key, value } as EventTarget & HTMLTextAreaElement,
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleTextEdit(pageId, id, event);
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = content.fontSize;
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [isEditing, content]);


  useEffect(() => {
    handleTopTextBar(isEditing, content, handleChange)
    handleContainerEditor(isEditing, {
      pageId: pageId,
      done: () => toggleEditing(pageId, id),
      deleteItem: () => handleDeleteItem(pageId, id),
      id: id,
      isTriangle: standardSpecs.type === 'Triangle' ? true : undefined
    });
  }, [isEditing, standardSpecs])


  return (
    <div ref={grandParentTriangleRef} style={{
      ...styles.draggableChildCont,
      padding: isEditing ? '-1px' : '1px',

    }}>
      <div style={{
        ...styles.mainTriangle,
        width: standardSpecs.width,
        height: standardSpecs.height,
        padding: isEditing ? '-1px' : '1px',
        backgroundColor: borderColor,
        boxSizing: "content-box",
      }} />
      <div style={{
        ...styles.innerTriangle,
        width: '100%',
        height: '100%',
        padding: isEditing ? '-1px' : '1px',
        backgroundColor: standardSpecs.backgroundColor,
        bottom: -standardSpecs.border / 2,
        position: 'absolute',
        transform: `scale(${1 - border / 100})`
      }} />

      <EditableText
        textData={content}
        isEditing={isEditing}
        onChange={(newValue) => {
          handleTextEdit(pageId, id, undefined, undefined, newValue)
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
  innerTriangleCont: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: -1

  } as React.CSSProperties,
  mainTriangle: {
    display: 'flex',
    width: `100%`,
    height: `100%`,
    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', // Creates a triangle shape
    overflow: 'hidden',
    zIndex: -2,
    position: 'absolute',
  } as React.CSSProperties,
  innerTriangle: {
    display: 'flex',
    width: `100%`,
    height: `100%`,
    clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)', // Creates a triangle shape
    overflow: 'hidden',
  } as React.CSSProperties,

};

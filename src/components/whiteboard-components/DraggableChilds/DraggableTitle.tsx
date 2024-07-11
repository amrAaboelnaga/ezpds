import React, { useRef } from 'react';
import { useDeleteItem, useHandleBlur, useHandleKeyDown, useHandleTextEdit } from '../../../handlers/whiteBoardHandlers';

interface DraggableTitleProps {
  id: string;
  content: string;
  isEditing: boolean;
  toggleEditing: (id: string) => void;
}


export function DraggableTitle({ id, content, isEditing, toggleEditing }: DraggableTitleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleTextEdit = useHandleTextEdit();
  const handleBlur = useHandleBlur();
  const handleKeyDown = useHandleKeyDown(handleBlur);
  const handleDeleteItem = useDeleteItem();

  return (
    <div style={styles.draggableChildCont}>
      {isEditing ? (
        <div style={styles.editTableCount}>
          <button onClick={() => toggleEditing(id)}>Done</button>
          <button onClick={() => handleDeleteItem(id)}>Delete</button>
        </div>
      ) : null}
      {isEditing === true ? (
        <input
          type='text'
          value={content}
          onChange={(e) => handleTextEdit(e, id)}
          autoFocus
          ref={inputRef}
          onKeyDown={(e) => handleKeyDown(e, id)}
          style={styles.inputStyle}
        />
      ) : (
        <h1>{content}</h1>
      )}
    </div>
  );
}



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
  inputStyle: {
    fontSize: '32px',
    fontWeight: 'bold',
    width: 'fit-content',
    height: '100%',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0)',
  } as React.CSSProperties,
};
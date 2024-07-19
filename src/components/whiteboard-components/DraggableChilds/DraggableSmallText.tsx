import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';


interface DraggableSmallTextProps {
  id: string;
  content: string;
  isEditing: boolean;
  toggleEditing: (id: string) => void;
}

export const DraggableSmallText: React.FC<DraggableSmallTextProps> = observer(({ id, content, isEditing, toggleEditing }) => {
  const { useDeleteItem, useHandleBlur, useHandleKeyDown, useHandleTextEdit } = useWhiteBoardHandlers();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleTextEdit = useHandleTextEdit();
  const handleBlur = useHandleBlur();
  const handleKeyDown = useHandleKeyDown(handleBlur);
  const handleDeleteItem = useDeleteItem();

  return (
    <div style={styles.draggableChildCont}>
      {isEditing && (
        <div style={styles.editTableCount}>
          <button onClick={() => toggleEditing(id)}>Done</button>
          <button onClick={() => handleDeleteItem(id)}>Delete</button>
        </div>
      )}
      {isEditing ? (
        <input
          type='text'
          value={content}
          onChange={(e) => handleTextEdit(e, id)}
          autoFocus
          ref={inputRef}
          onKeyDown={(e) => handleKeyDown(e, id)}
          style={styles.tableInput}
        />
      ) : (
        <p>{content}</p>
      )}
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
    textAlign: 'center',
  } as React.CSSProperties,
  editTableCount: {
    position: 'absolute',
    right: '-60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  } as React.CSSProperties,
  tableInput: {
    fontSize: '16px',
    border: '0px',
    backgroundColor: '#00000000',
    outline: 'none',
    width: '100%',
    textAlign: 'center',
  } as React.CSSProperties,
};


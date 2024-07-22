import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';


interface DraggableSubTitleProps {
  id: string;
  content: string;
  isEditing: boolean;
  toggleEditing: (id: string) => void;
}

export const DraggableSubTitle: React.FC<DraggableSubTitleProps> = observer(({ id, content, isEditing, toggleEditing }) => {
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
          style={styles.inputStyle}
        />
      ) : (
        <h2>{content}</h2>
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
  inputStyle: {
    fontSize: '24px',
    fontWeight: 'bold',
    width: 'fit-content',
    height: '100%',
    border: 'none',
    outline: 'none',
    textAlign: 'center',
    backgroundColor: '#ffffff00',
  } as React.CSSProperties,
};

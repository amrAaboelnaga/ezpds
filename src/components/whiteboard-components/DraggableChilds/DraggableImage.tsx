import React, { useRef } from 'react';
import { useDeleteItem, useHandleAddImage, useHandleImageUpload } from '../../../handlers/whiteBoardHandlers';

interface DraggableImageProps {
  id: string;
  imgData: string;
  isEditing: boolean;
  toggleEditing: (id: string) => void;
}

export function DraggableImage({ id, imgData, isEditing, toggleEditing }: DraggableImageProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = useHandleImageUpload();
  const handleAddImage = useHandleAddImage(inputRef);
  const handleDeleteItem = useDeleteItem();

  return (
    <div>
      {isEditing ? (
        <div style={styles.editTableCount}>
          <button onClick={() => toggleEditing(id)}>Done</button>
          {imgData ? <button onClick={() => handleAddImage(id)}>Edit</button> : null}
          <button onClick={() => handleDeleteItem(id)}>Delete</button>
        </div>
      ) : null}
      {imgData ? (
        <img style={styles.draggableImage} src={imgData} alt='Uploaded' />
      ) : (
        <button style={styles.addImageButton} onClick={() => handleAddImage(id)}>Add Image</button>
      )}
      <input
        type='file'
        accept='image/*'
        onChange={(e) => handleImageUpload(e, id)}
        style={{ display: 'none' }}
        ref={inputRef}
      />
    </div>
  );
}

const styles = {
  editTableCount: {
    position: 'absolute',
    right: '-60px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  } as React.CSSProperties,
  draggableImage: {
    width: '100%',
    height: 'auto',
  } as React.CSSProperties,
  addImageButton: {
    fontSize: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#0000ff', // Adjust color as needed
  } as React.CSSProperties,
};

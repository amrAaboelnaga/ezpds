import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { DraggableImageInterface } from '../../../types/whiteBoard';

interface DraggableImageProps {
  id: string;
  standardSpecs: DraggableImageInterface
  toggleEditing: (pageId: number, id: string) => void;
  pageId: number
}

export const DraggableImage: React.FC<DraggableImageProps> = observer(({ id, standardSpecs, toggleEditing, pageId }) => {
  const { useDeleteItem, useHandleAddImage, useHandleImageUpload, useHandleContainerEditorBar, useZIndexHandler } = useWhiteBoardHandlers();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleImageUpload = useHandleImageUpload();
  const handleAddImage = useHandleAddImage(inputRef);
  const handleDeleteItem = useDeleteItem();
  const handleContainerEditor = useHandleContainerEditorBar()
  const { padding, src, isEditing, border, borderColor, borderRadius, backgroundColor } = standardSpecs


  useEffect(() => {
    handleContainerEditor(isEditing, { pageId: pageId, done: () => toggleEditing(pageId, id), deleteItem: () => handleDeleteItem(pageId, id), id: id, addImg: () => handleAddImage(id) });
  }, [isEditing, standardSpecs]);

  return (
    <div
      style={{
        display: 'flex',
        borderRadius: borderRadius,
      }}   >
      {src ? (
        <img
          onDragStart={(e) => e.preventDefault()}
          style={{
            ...styles.draggableImage,
            border: `${border}px solid ${borderColor}`,
            borderRadius: borderRadius,
            padding: padding,
            backgroundColor: backgroundColor
          }}
          src={src} alt='Uploaded' />
      ) : (
        <button style={styles.addImageButton} onClick={() => handleAddImage(id)}>Add Image</button>
      )}
      <input
        type='file'
        accept='image/*'
        onChange={(e) => handleImageUpload(pageId, e, id)}
        style={{ display: 'none' }}
        ref={inputRef}
      />
    </div>
  );
});

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
    userSelect: "none"
  } as React.CSSProperties,
  addImageButton: {
    fontSize: '16px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    color: '#0000ff', // Adjust color as needed
  } as React.CSSProperties,
};


import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { rootStore } from '../../../stores/rootStore';
import ContainerEditor from '../ContainerEditor';


interface TestComponentProps {
  id: string;

}

export const TestComponent: React.FC<TestComponentProps> = observer(({ id }) => {
  const { useHandleTextEdit, useZIndexHandler, useHandleBlur, useHandleKeyDown, useDeleteItem, useHandleTopTextBar } = useWhiteBoardHandlers();

  const { whiteBoardStore } = rootStore;

  return (
    <div>
      {(whiteBoardStore.containerEditor) && (whiteBoardStore.pages[0].jsonSpecs[id])?.isEditing && (
        <div
          className='ContainerEditor'
          id="ContainerEditor"
          style={{
            position: 'absolute',
            top: 0,
            right: `-250px`,
            height: 'fit-content',

          }}>
          <ContainerEditor
            data={whiteBoardStore.containerEditor}
            standardSpecs={(whiteBoardStore.pages[0].jsonSpecs[id]) || {}}
          />
        </div>
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

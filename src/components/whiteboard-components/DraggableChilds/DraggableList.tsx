import React, { useState } from 'react';
import { JsonSpecs, useDeleteItem } from '../../../handlers/whiteBoardHandlers';
import { rootStore } from "../../../stores/rootStore";

const { whiteBoardStore } = rootStore;

interface DraggableListProps {
  id: string;
  listData: string[];
  isEditing: boolean;
  toggleEditing: (id: string) => void;
}

export function DraggableList({
  id,
  listData,
  isEditing,
  toggleEditing,
}: DraggableListProps) {
  const [editedListData, setEditedListData] = useState<string[]>(listData);

  const handleDeleteItem = useDeleteItem();

  const addList = () => {
    const updatedListData = [...editedListData, 'New Item']; // Add a new default list item
    setEditedListData(updatedListData);
    updateListSpecs(updatedListData);
  };

  const removeList = () => {
    if (editedListData.length === 0) return;
    const updatedListData = editedListData.slice(0, -1); // Remove the last item
    setEditedListData(updatedListData);
    updateListSpecs(updatedListData);
  };

  const handleListItemChange = (index: number, newValue: string) => {
    const updatedListData = [...editedListData];
    updatedListData[index] = newValue;
    setEditedListData(updatedListData);
    updateListSpecs(updatedListData);
  };

  const updateListSpecs = (updatedListData: string[]) => {
    const updatedSpecs = {
      ...whiteBoardStore.jsonSpecs,
      [id]: {
        ...whiteBoardStore.jsonSpecs[id],
        listData: updatedListData,
      },
    };
    whiteBoardStore.setJsonSpecs(updatedSpecs);
  };

  return (
    <div style={styles.draggableChildCont}>
      {isEditing && (
        <div style={styles.editTableCount}>
          <button onClick={() => toggleEditing(id)}>Done</button>
          <button onClick={addList}>List +</button>
          <button onClick={removeList}>List -</button>
          <button onClick={() => handleDeleteItem(id)}>Delete</button>
        </div>
      )}

      {isEditing ? (
        <div style={styles.draggableList}>
          {editedListData.map((item, index) => (
            <input
              key={index}
              type="text"
              value={item}
              onChange={(e) => handleListItemChange(index, e.target.value)}
              style={styles.tableInput}
            />
          ))}
        </div>
      ) : (
        <div style={styles.draggableList}>
          {editedListData.map((item, index) => (
            <p key={index} style={styles.draggableListItem}>- {item}</p>
          ))}
        </div>
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
  draggableList: {
    width: '100%',
    textAlign: 'left',
    fontSize: '16px',
    marginTop: '10px', // Adjust as needed
  } as React.CSSProperties,
  draggableListItem: {
    margin: '3px',
  } as React.CSSProperties,
  tableInput: {
    display: 'flex',
    textAlign: 'center',
    width: '100%',
    border: '0px',
    backgroundColor: '#00000000',
    fontSize: '16px',
    marginBottom: '0px', // Adjust as needed
  } as React.CSSProperties,
};

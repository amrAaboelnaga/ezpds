import React from 'react';
import { observer } from 'mobx-react-lite';
import { DraggableTableInterface } from '../../../types/whiteBoard';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';

interface TableTextModifierProps {
    id: string;
    standardSpecs: DraggableTableInterface;
    pageId: number;
}

const TableTextModifier: React.FC<TableTextModifierProps> = ({ id, standardSpecs, pageId }) => {
    const { useUpdateTableSpecs, useHandleCellChange } = useWhiteBoardHandlers();
    const updateTableSpecs = useUpdateTableSpecs();
    const handleCellChange = useHandleCellChange(pageId, standardSpecs.data, id, updateTableSpecs);

    return (
        <div style={{ ...styles.container, backgroundColor: standardSpecs.repeate === true ? "#dddddd" : "" }}>
            <p style={styles.name}>{id}</p>
            <div style={styles.tableContainer}>
                {standardSpecs.data.map((row, rowIndex) => (
                    <div key={rowIndex} style={{ ...styles.row, backgroundColor: rowIndex % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                        {row.map((cell, colIndex) => (
                            <input
                                key={`${rowIndex}-${colIndex}`}
                                type="text"
                                value={cell.content}
                                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                                style={styles.input}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '7px',
        width: '100%',
        padding: '5px',
        borderRadius: '8px',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    } as React.CSSProperties,
    name: {
        fontSize: '14px',
        fontWeight: '500',
        margin: '0 0 2px 0',
        color: '#333',
    } as React.CSSProperties,
    tableContainer: {
        display: 'flex',
        flexDirection: 'column',
    } as React.CSSProperties,
    row: {
        display: 'flex',
        gap: '5px',
        padding: '0px',
    } as React.CSSProperties,
    input: {
        padding: '1px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '100%',
        fontSize: '12px',
        marginBottom: '2px',
    } as React.CSSProperties,
};

export default observer(TableTextModifier);

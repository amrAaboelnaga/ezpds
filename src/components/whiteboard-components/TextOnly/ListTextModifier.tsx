import React from 'react';
import { DraggableListInterface } from '../../../types/whiteBoard';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { observer } from 'mobx-react-lite';

interface ListTextModifierProps {
    id: string;
    standardSpecs: DraggableListInterface;
    pageId: number;
}

const ListTextModifier: React.FC<ListTextModifierProps> = ({ id, standardSpecs, pageId }) => {
    const { useHandleListItemChange, useUpdateListSpecs } = useWhiteBoardHandlers();
    const updateListSpecs = useUpdateListSpecs();
    const handleListItemChange = useHandleListItemChange(pageId, standardSpecs.data, id, standardSpecs.gap, standardSpecs.backgroundColor, standardSpecs.zIndex, updateListSpecs);

    return (
        <div style={{ ...styles.container, backgroundColor: standardSpecs.repeate === true ? "#dddddd" : "" }}>
            <p style={styles.name}>{id}</p>
            {standardSpecs.data.map((item, index) => (
                <input
                    key={index}
                    type="text"
                    value={item.content}
                    onChange={(e) => handleListItemChange(index, e.target.value)}
                    style={{ ...styles.input, backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}
                />
            ))}
        </div>
    );
};

const styles = {
    container: {
        marginBottom: '7px',
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
    input: {
        padding: '1px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        width: '100%',
        fontSize: '12px',
        marginBottom: '2px',
    } as React.CSSProperties,
};

export default observer(ListTextModifier);

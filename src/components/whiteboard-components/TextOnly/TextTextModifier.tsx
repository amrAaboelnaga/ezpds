import React from 'react';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { observer } from 'mobx-react-lite';

interface TextTextModifierProps {
    id: string;
    standardSpecs: any; // Use the appropriate interface based on the item type
    pageId: number; // Since pageId is a number
}

const TextTextModifier: React.FC<TextTextModifierProps> = ({ id, standardSpecs, pageId }) => {
    const { useHandleTextEdit } = useWhiteBoardHandlers();
    const handleTextEdit = useHandleTextEdit();

    return (
        <div style={{ ...styles.container, backgroundColor: standardSpecs.repeate === true ? "#dddddd" : "" }}>
            <p style={styles.name}>{id}</p>
            <input
                type="text"
                value={standardSpecs.data.content}
                onChange={(e) => handleTextEdit(pageId, id, undefined, undefined, e.currentTarget.value)}
                style={styles.input}
            />
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

export default observer(TextTextModifier);

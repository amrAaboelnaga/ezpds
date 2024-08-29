import React, { useRef } from 'react';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { DraggableImageInterface } from '../../../types/whiteBoard';

interface ImageLinkModifierProps {
    id: string;
    standardSpecs: DraggableImageInterface;
    pageId: number;
}

const ImageLinkModifier: React.FC<ImageLinkModifierProps> = ({ id, standardSpecs, pageId }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const { useHandleImageUpload, useHandleAddImage } = useWhiteBoardHandlers();
    const handleImageUpload = useHandleImageUpload();
    const handleAddImage = useHandleAddImage(inputRef);


    return (
        <div style={{ ...styles.container, backgroundColor: standardSpecs.repeate === true ? "#dddddd" : "" }}>
            <p style={styles.name}>{id}</p>
            {standardSpecs.src && <img style={{ height: '100px' }} src={standardSpecs.src} />}
            {standardSpecs.src ?
                <i onClick={() => handleAddImage(id)} className="fa fa-edit textEditButton" style={styles.button} ></i>
                :
                <i onClick={() => handleAddImage(id)} className="fa fa-plus textEditButton" style={styles.button} ></i>
            }
            <input
                type='file'
                accept='image/*'
                onChange={(e) => handleImageUpload(pageId, e, id)}
                style={{ display: 'none' }}
                ref={inputRef}
            />
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
        display: 'flex', gap: '10px'
    } as React.CSSProperties,
    name: {
        fontSize: '14px',
        fontWeight: '500',
        margin: '0 0 2px 0',
        color: '#333',
    } as React.CSSProperties,
    button: {
        borderRadius: '3px',
        padding: '3px',
        transform: 'scale(1)',
        cursor: "pointer",
        height: '22px'
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
export default ImageLinkModifier;

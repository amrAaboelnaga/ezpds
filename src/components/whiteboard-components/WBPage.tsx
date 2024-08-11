import React, { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { DraggableItem } from './DraggableItem';
import ContainerEditor from './ContainerEditor';
import PageGuids from './PageGuids';
import RulerComponent from './RulerComponent';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { rootStore } from "../../stores/rootStore";
import { DraggableRepeate } from './DraggableRepeate';

interface WBPageProps {
    index: number; // Add index prop
}

const WBPage: React.FC<WBPageProps> = ({ index }) => {
    const { whiteBoardStore } = rootStore;
    const { useHandleDrop, useHandleDragOver, useToggleEditing } = useWhiteBoardHandlers();
    const page = useRef<HTMLDivElement>(null);
    const handleDrop = useHandleDrop();
    const handleDragOver = useHandleDragOver();
    const toggleEditing = useToggleEditing();

    // Get the current page's jsonSpecs using the index
    const currentPage = whiteBoardStore.pages[index];
    const jsonSpecs = currentPage?.jsonSpecs || {};
    console.log(jsonSpecs)
    return (
        <div ref={page} style={styles.workSpaceFile} onDrop={(e) => handleDrop(e, index)} onDragOver={handleDragOver}>
            {(whiteBoardStore.containerEditor) && (whiteBoardStore.pages[index].jsonSpecs[whiteBoardStore.containerEditor.id])?.isEditing && (
                <div
                    id="ContainerEditor"
                    style={{
                        position: 'absolute',
                        top: (jsonSpecs[whiteBoardStore.containerEditor.id]?.location?.y || 0),
                        left: `calc(${jsonSpecs[whiteBoardStore.containerEditor.id]?.location?.x || 0}px + ${jsonSpecs[whiteBoardStore.containerEditor.id]?.width || 0} + 10px)`,
                        height: jsonSpecs[whiteBoardStore.containerEditor.id]?.height || 0,
                    }}>
                    <ContainerEditor
                        data={whiteBoardStore.containerEditor}
                        standardSpecs={jsonSpecs[whiteBoardStore.containerEditor.id] || {}}
                    />
                </div>
            )}
            {Object.keys(jsonSpecs).map((id) => {
                if (jsonSpecs[id].repeate === false) {
                    return (
                        <DraggableItem
                            key={id}
                            id={id}
                            itemSpecs={jsonSpecs[id]}
                            toggleEditing={toggleEditing}
                            pageId={index}
                        />
                    );
                }
            })}
            {Object.keys(whiteBoardStore.pages[0].jsonSpecs).map((id) => {
                if (whiteBoardStore.pages[0].jsonSpecs[id].repeate === true) {
                    return (
                        <DraggableRepeate
                            key={id}
                            id={id}
                            itemSpecs={whiteBoardStore.pages[0].jsonSpecs[id]}
                            toggleEditing={toggleEditing}
                            pageId={index}
                        />
                    );
                }
            })}
            <RulerComponent />
            <PageGuids pageId={index} />
            <div style={styles.rulerHider} />
            <button onClick={() => whiteBoardStore.deletePage(index)} style={styles.delPageButton}>Delete Page</button>
        </div>
    );
};

const styles = {
    workSpaceFile: {
        width: '210mm',
        height: '297mm',
        backgroundColor: 'white',
        margin: '60px auto',
        position: 'relative',
        marginBottom: '150px'
    } as React.CSSProperties,
    rulerHider: {
        position: 'absolute',
        bottom: '0px',
        left: '-45px',
        width: '20px',
        height: '20px',
        backgroundColor: 'rgb(214, 214, 214)',

    } as React.CSSProperties,
    delPageButton: {
        position: 'absolute',
        top: '0px',
        right: '-100px',
        width: '60px',
        height: '40px',
        borderRadius: '10px'
    } as React.CSSProperties,
};

export default observer(WBPage);

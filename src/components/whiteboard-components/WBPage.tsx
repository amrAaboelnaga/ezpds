import React, { useEffect, useRef, useState } from 'react';
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
    isExporting: boolean; // New prop
    setIsExporting: React.Dispatch<React.SetStateAction<boolean>>; // Function to update exporting state
}


const WBPage: React.FC<WBPageProps> = ({ index, isExporting }) => {
    const { whiteBoardStore } = rootStore;
    const { useHandleDrop, useHandleDragOver, useToggleEditing } = useWhiteBoardHandlers();
    const [showItems, setShowItems] = useState(false)
    const pageRef = useRef<HTMLDivElement>(null);
    const handleDrop = useHandleDrop();
    const handleDragOver = useHandleDragOver();
    const toggleEditing = useToggleEditing();

    useEffect(() => {
        const page = pageRef.current;
        const options: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: [0.01, 0.5] }; // Multiple thresholds
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                // Check which threshold was crossed
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.5) {
                        whiteBoardStore.setCurrentPage(index)
                    }
                    if (entry.intersectionRatio <= 0.01) {
                        setShowItems(false);
                    } else if (entry.intersectionRatio >= 0.01) {
                        setShowItems(true);
                    }

                } else {

                }
            });
        };
        const observer = new IntersectionObserver(handleIntersection, options);
        if (page) {
            observer.observe(page);
        }
        return () => {
            if (page) {
                observer.unobserve(page);
            }
        };
    }, []);

    useEffect(() => {
        if (isExporting === true) {
            setShowItems(true)
        }
    }, [isExporting])


    const currentPage = whiteBoardStore.pages[index];
    const jsonSpecs = currentPage?.jsonSpecs || {};
    //console.log(jsonSpecs)
    return (
        <div id={`pageIndex${index}`} ref={pageRef} style={styles.workSpaceFile} onDrop={(e) => handleDrop(e, index)} onDragOver={handleDragOver}>
            {isExporting === false && (whiteBoardStore.containerEditor) && (whiteBoardStore.containerEditor.pageId === index) && (whiteBoardStore.pages[index].jsonSpecs[whiteBoardStore.containerEditor.id])?.isEditing && (
                <div
                    className='ContainerEditor'
                    id="ContainerEditor"
                    style={{
                        position: 'absolute',
                        top: (jsonSpecs[whiteBoardStore.containerEditor.id]?.location?.y || 0),
                        left: `calc(${jsonSpecs[whiteBoardStore.containerEditor.id]?.location?.x || 0}px + ${jsonSpecs[whiteBoardStore.containerEditor.id]?.width || 0} + 10px)`,
                        //left: (jsonSpecs[whiteBoardStore.containerEditor.id]?.location?.x - 230 || 0),
                        height: jsonSpecs[whiteBoardStore.containerEditor.id]?.height || 0,
                    }}>
                    <ContainerEditor
                        data={whiteBoardStore.containerEditor}
                        standardSpecs={jsonSpecs[whiteBoardStore.containerEditor.id] || {}}
                    />
                </div>
            )}
            {showItems && Object.keys(jsonSpecs).map((id) => {
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
            {showItems && Object.keys(whiteBoardStore.pages[0].jsonSpecs).map((id) => {
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
            {isExporting === false && <RulerComponent />}
            {isExporting === false && <PageGuids pageId={index} />}
            {isExporting === false && <div style={styles.rulerHider} />}
        </div>
    );
};

const styles = {
    workSpaceFile: {
        width: '100%',
        height: "100%",
        backgroundColor: 'white',
        position: 'absolute',
        top: '0px',
        left: "0px"
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

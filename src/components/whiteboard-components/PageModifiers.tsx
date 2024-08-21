import React from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SingleSmallPageCont from './SingleSmallPageCont';

const PageModifiers: React.FC = () => {
    const { whiteBoardStore } = rootStore;

    const handleScroll = (e: React.MouseEvent<HTMLDivElement, MouseEvent>, pageId: number) => {
        e.preventDefault();
        const targetElement = document.getElementById(`pageIndex${pageId}`);

        if (targetElement) {
            const topPosition = targetElement.getBoundingClientRect().top + window.scrollY - 55;

            window.scrollTo({
                top: topPosition,
                behavior: 'smooth',
            });
        }
    };

    const handleOnDragEnd = (result: any) => {
        whiteBoardStore.handleOnDragEnd(result);
    };
    console.log(whiteBoardStore.pages.length)   //Don't Delete this.
    console.log(whiteBoardStore.currentPage)    //Don't Delete this.
    return (
        <div style={{ ...styles.pageModiferCont, top: whiteBoardStore.textContent ? '80px' : '50px', maxHeight: `calc(100vh - ${whiteBoardStore.textContent ? "80px" : "50px"})`, }}>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="droppable" direction="vertical">
                    {(provided) => (
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {whiteBoardStore.pages.map((page, index) => (
                                <Draggable key={page.id} draggableId={page.id.toString()} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{ ...provided.draggableProps.style }}
                                        >
                                            <SingleSmallPageCont
                                                index={index}
                                                isActive={whiteBoardStore.currentPage === index}
                                                onScroll={handleScroll}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

const styles = {
    pageModiferCont: {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: '100px',
        padding: '5px',
        paddingBottom: '0px',
        borderBottomRightRadius: '5px',
        backgroundColor: 'rgb(221, 221, 221)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.4s',
        overflowY: 'auto',
        alignItems: 'center',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
    } as React.CSSProperties, 
};

export default observer(PageModifiers);

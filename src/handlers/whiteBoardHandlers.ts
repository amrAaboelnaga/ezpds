import { rootStore } from "../stores/rootStore";
import { useState } from "react";
const { whiteBoardStore } = rootStore;

export interface JsonSpecs {
    [key: string]: {
        type: string;
        content: string;
        location: { x: number; y: number };
        width: number;
        height: number;
        isEditing: boolean;
        imgData: string;
        rows?: number;
        columns?: number;
        tableData?: string[][];
        listData?: string[];
    };
}

export function useHandleDrop() {
    return (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        const itemType = event.dataTransfer.getData('itemType');
        const id = `${itemType}-${Object.keys(whiteBoardStore.jsonSpecs).length}`;
        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left - (itemType === 'table' ? 150 : 50);
        const y = event.clientY - rect.top - (itemType === 'table' ? 50 : 25);

        const defaultRows = 4;
        const defaultColumns = 4;
        const defaultTableData = Array.from({ length: defaultRows }, () =>
            Array.from({ length: defaultColumns }, () => 'Add Data')
        );

        const defaultListData = ['Add Data', 'Add Data', 'Add Data']; // Default list items

        const newSpec = {
            [id]: {
                type: itemType,
                content: itemType,
                location: { x, y },
                width: itemType === 'table' ? 300 : 100,
                height: itemType === 'table' ? 200 : 50,
                isEditing: false,
                imgData: '',
                rows: itemType === 'table' ? defaultRows : undefined,
                columns: itemType === 'table' ? defaultColumns : undefined,
                tableData: itemType === 'table' ? defaultTableData : undefined,
                listData: itemType === 'list' ? defaultListData : undefined, // Set default list data
            },
        };

        whiteBoardStore.setJsonSpecs({
            ...whiteBoardStore.jsonSpecs,
            ...newSpec,
        });
    };
}

export function useHandleDragOver() {
    return (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };
}

export function useToggleEditing() {
    return (id: string) => {
        const updatedSpecs = {
            ...whiteBoardStore.jsonSpecs,
            [id]: {
                ...whiteBoardStore.jsonSpecs[id],
                isEditing: !whiteBoardStore.jsonSpecs[id].isEditing,
            },
        };
        whiteBoardStore.setJsonSpecs(updatedSpecs);
    };
}

export function useDeleteItem() {
    return (id: string) => {
        const updatedSpecs = { ...whiteBoardStore.jsonSpecs };
        if (id in updatedSpecs) {
            delete updatedSpecs[id];
        }
        whiteBoardStore.setJsonSpecs(updatedSpecs);
    };
}


export function useHandleTextEdit() {
    return (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const { value } = event.target;

        const updatedSpecs = {
            ...whiteBoardStore.jsonSpecs,
            [id]: {
                ...whiteBoardStore.jsonSpecs[id],
                content: value,
            },
        };
        whiteBoardStore.setJsonSpecs(updatedSpecs);
    };
}

export function useHandleKeyDown(handleBlur: (id: string) => void) {
    return (event: React.KeyboardEvent<HTMLInputElement>, id: string) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleBlur(id);
        }
    };
}

export function useHandleBlur() {
    return (id: string) => {
        const updatedSpecs = {
            ...whiteBoardStore.jsonSpecs,
            [id]: {
                ...whiteBoardStore.jsonSpecs[id],
                isEditing: false,
            },
        };
        whiteBoardStore.setJsonSpecs(updatedSpecs);
    };
}

export function useHandleAddImage(inputRef: React.RefObject<HTMLInputElement>) {
    return (id: string) => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };
}

export function useHandleImageUpload() {
    return (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
        const file = event.target.files?.[0];

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;

                const updatedSpecs = {
                    ...whiteBoardStore.jsonSpecs,
                    [id]: {
                        ...whiteBoardStore.jsonSpecs[id],
                        imgData: base64String,
                    },
                };
                whiteBoardStore.setJsonSpecs(updatedSpecs);
            };

            reader.readAsDataURL(file);
        }
    };
}


export function useHandleMouseDownReposition(
    jsonSpecs: JsonSpecs,
    setJsonSpecs: React.Dispatch<React.SetStateAction<JsonSpecs>>
) {
    return (
        event: React.MouseEvent<HTMLDivElement>,
        id: string
    ) => {
        if (jsonSpecs[id].isEditing) return;

        const offsetX = event.clientX - jsonSpecs[id].location.x;
        const offsetY = event.clientY - jsonSpecs[id].location.y;

        const handleMouseMoveReposition = (event: MouseEvent) => {
            setJsonSpecs((prev) => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    location: {
                        x: event.clientX - offsetX,
                        y: event.clientY - offsetY,
                    },
                },
            }));
        };

        const handleMouseUpReposition = () => {
            document.removeEventListener('mousemove', handleMouseMoveReposition);
            document.removeEventListener('mouseup', handleMouseUpReposition);
        };

        document.addEventListener('mousemove', handleMouseMoveReposition);
        document.addEventListener('mouseup', handleMouseUpReposition);
    };
}

export function useResizeState(initialState: {
    resizing: boolean;
    direction: string;
    initialMouseX: number;
    initialMouseY: number;
    initialWidth: number;
    initialHeight: number;
}) {
    const [resizeState, setResizeState] = useState(initialState);

    return { resizeState, setResizeState };
}


export function useHandleMouseDownResize(
    jsonSpecs: JsonSpecs,
    id: string | null,
    setResizeState: React.Dispatch<React.SetStateAction<{
        resizing: boolean;
        direction: string;
        initialMouseX: number;
        initialMouseY: number;
        initialWidth: number;
        initialHeight: number;
    }>>
) {
    return (
        event: React.MouseEvent<HTMLDivElement>,
        direction: string
    ) => {
        if (!jsonSpecs[id!].isEditing) return;

        event.preventDefault();
        event.stopPropagation();

        const initialWidth = jsonSpecs[id!].width;
        const initialHeight = jsonSpecs[id!].height;

        setResizeState({
            resizing: true,
            direction,
            initialMouseX: event.clientX,
            initialMouseY: event.clientY,
            initialWidth,
            initialHeight,
        });
    };
}

export function useHandleMouseMove(
    jsonSpecs: JsonSpecs,
    id: string | null,
    resizeState: {
        resizing: boolean;
        direction: string;
        initialMouseX: number;
        initialMouseY: number;
        initialWidth: number;
        initialHeight: number;
    },
    setJsonSpecs: React.Dispatch<React.SetStateAction<JsonSpecs>>
) {
    return (event: MouseEvent) => {
        if (!resizeState.resizing || !id) return;

        const deltaX = event.clientX - resizeState.initialMouseX;
        const deltaY = event.clientY - resizeState.initialMouseY;

        let newWidth = resizeState.initialWidth + deltaX;
        let newHeight = resizeState.initialHeight + deltaY;

        let newLeft = jsonSpecs[id].location.x;
        let newTop = jsonSpecs[id].location.y;

        if (resizeState.direction.includes('left')) {
            newLeft = jsonSpecs[id].location.x + deltaX;
            newWidth = resizeState.initialWidth - deltaX;
        }
        if (resizeState.direction.includes('top')) {
            newTop = jsonSpecs[id].location.y + deltaY;
            newHeight = resizeState.initialHeight - deltaY;
        }

        setJsonSpecs((prev) => ({
            ...prev,
            [id!]: {
                ...prev[id!],
                location: {
                    x: newLeft,
                    y: newTop,
                },
                width: newWidth,
                height: newHeight,
            },
        }));
    };
}

export function useHandleMouseUp(setResizeState: React.Dispatch<React.SetStateAction<{
    resizing: boolean;
    direction: string;
    initialMouseX: number;
    initialMouseY: number;
    initialWidth: number;
    initialHeight: number;
}>>) {
    return () => {
        setResizeState({
            resizing: false,
            direction: '',
            initialMouseX: 0,
            initialMouseY: 0,
            initialWidth: 0,
            initialHeight: 0,
        });
    };
}
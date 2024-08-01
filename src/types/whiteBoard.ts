export interface DraggableItemInterface {
    type: string;
    location: { x: number; y: number };
    width: string;
    height: string;
    isEditing: boolean;
    backgroundColor: string;
    zIndex: number;
    opacity: number;
    border: number;
    borderColor: string;
    borderRadius: number;
    padding: number
}

export interface Text {
    content: string;
    color: string;
    fontSize: string;
    textDecoration: string;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
    fontWeight: 'normal' | 'bold';
    fontStyle: 'normal' | 'italic';
    letterSpacing: string;
    lineHeight: string;
    fontFamily: string;
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
    whiteSpace: string;
    wordBreak: 'normal' | 'break-all' | 'keep-all';
    height: string; // Add this line
    width: string;
}

export interface DraggableTextInterface extends DraggableItemInterface {
    type: 'Text';
    data: Text;
}

export interface DraggableListInterface extends DraggableItemInterface {
    type: 'List';
    data: Text[];
    gap: string;
    rowHeight: RowHeight
}

export interface RowHeight {
    [key: number]: { height?: number };
}

export interface DraggableTableInterface extends DraggableItemInterface {
    type: 'Table';
    rows: number;
    columns: number;
    rowGap: number;
    columnGap: number;
    data: Text[][];
    cellDimensions: CellDimensions
}

export interface CellDimensions {
    [key: string]: { width?: string; height?: string };
}

export interface DraggableImageInterface extends DraggableItemInterface {
    src: any;
}

export type JsonSpecs = {
    [key: string]: DraggableItemInterface | DraggableTextInterface | DraggableListInterface | DraggableTableInterface | DraggableImageInterface;
};

export interface ProductInfo {
    id: number;
    title: string;
    price: string;
    category: string;
}




export const defaultText: Text = {
    content: `Edit me`,
    color: '#000000',
    fontSize: '16px',
    textDecoration: 'none',
    backgroundColor: '#ffffff00',
    textAlign: 'center',
    fontWeight: 'normal',
    fontStyle: 'normal',
    letterSpacing: '0px',
    lineHeight: '1',
    fontFamily: 'Arial, sans-serif',
    textTransform: 'none',
    whiteSpace: 'pre-wrap',
    wordBreak: 'normal',
    height: '100%',
    width: '100%'
};

const defaultRows = 4;
const defaultColumns = 4;
const defaultTableData: Text[][] = Array.from({ length: defaultRows }, () =>
    Array.from({ length: defaultColumns }, () => defaultText)
);

export const createDraggableTextSpec = (id: string, x: number, y: number): DraggableTextInterface => ({
    type: 'Text',
    location: { x, y },
    width: '100px',
    height: '50px',
    isEditing: false,
    backgroundColor: 'transparent',
    zIndex: 1,
    data: defaultText,
    opacity: 1,
    border: 0,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 0
});

export const createDraggableImageSpec = (id: string, x: number, y: number): DraggableImageInterface => ({
    type: 'Image',
    location: { x, y },
    width: '100px',
    height: '100px',
    isEditing: false,
    backgroundColor: '#ffffff00',
    zIndex: 1,
    src: null,
    opacity: 1,
    border: 0,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 0

});

export const createDraggableListSpec = (id: string, x: number, y: number): DraggableListInterface => ({
    type: 'List',
    location: { x, y },
    width: '300px',
    height: '200px',
    isEditing: false,
    backgroundColor: '#ffffff00',
    zIndex: 1,
    data: [defaultText, defaultText, defaultText, defaultText], // Default list items
    gap: '10px',
    opacity: 1,
    border: 0,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 0,
    rowHeight: {}

});



export const createDraggableTableSpec = (id: string, x: number, y: number): DraggableTableInterface => ({
    type: 'Table',
    location: { x, y },
    width: '500px',
    height: '150px',
    isEditing: false,
    backgroundColor: '#ffffff00',
    zIndex: 1,
    rows: defaultRows,
    columns: defaultColumns,
    rowGap: 0,
    columnGap: 0,
    data: defaultTableData,
    cellDimensions: {}, // Initialize with an empty object or a default structure if needed
    opacity: 1,
    border: 0,
    borderColor: '#000000',
    borderRadius: 0,
    padding: 0

});
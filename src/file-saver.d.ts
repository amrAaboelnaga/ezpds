declare module 'file-saver' {
    export function saveAs(blob: Blob, fileName?: string): void;
    export function saveTextAs(text: string, fileName?: string): void;
}

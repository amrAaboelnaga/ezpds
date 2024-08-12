import React, { useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { Text } from '../../types/whiteBoard';


interface EditableTextProps {
    textData: Text;
    isEditing: boolean;
    onChange: (newValue: string) => void;
    onFocus: () => void;
    onBlur: (event: React.FocusEvent) => void;
    type?: string;
    pageNumbHelper?: number;

}

export const EditableText: React.FC<EditableTextProps> = observer(({
    textData,
    isEditing,
    onChange,
    onFocus,
    onBlur,
    type,
    pageNumbHelper
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [focused, setFocused] = React.useState(false)
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = textData.fontSize;
            textareaRef.current.style.height = (textareaRef.current.scrollHeight) + 'px';
        }
    }, [isEditing, textData, onBlur]);

    return (
        <div style={{ ...styles.EditableTextCont }}>
            {isEditing && type !== 'PageNumber' ? (
                <textarea

                    name="content"
                    value={`${textData.content}`}
                    onFocus={() => {
                        onFocus();
                        setFocused(true)
                    }}
                    onBlur={(e) => {
                        //onBlur(e);
                        setFocused(false)
                    }}
                    onChange={(e) => {
                        onChange(e.target.value);
                        e.target.style.height = e.target.scrollHeight + 'px';
                    }}

                    ref={textareaRef}
                    style={{
                        ...styles.textareaStyle,
                        fontSize: textData.fontSize,
                        fontWeight: textData.fontWeight,
                        fontStyle: textData.fontStyle,
                        color: textData.color,
                        textDecoration: textData.textDecoration,
                        textAlign: textData.textAlign,
                        justifyContent: textData.textAlign,
                        letterSpacing: textData.letterSpacing,
                        lineHeight: textData.lineHeight,
                        fontFamily: textData.fontFamily,
                        textTransform: textData.textTransform,
                        whiteSpace: textData.whiteSpace,
                        wordBreak: textData.wordBreak,
                        boxShadow: focused ? 'inset 0 0 0 1px blue' : 'none',
                        height: textData.fontSize
                    }}
                />
            ) : (
                <p style={{
                    ...styles.text,
                    fontSize: textData.fontSize,
                    fontWeight: textData.fontWeight,
                    fontStyle: textData.fontStyle,
                    color: textData.color,
                    textDecoration: textData.textDecoration,
                    textAlign: textData.textAlign,
                    justifyContent: textData.textAlign,
                    letterSpacing: textData.letterSpacing,
                    lineHeight: textData.lineHeight,
                    fontFamily: textData.fontFamily,
                    textTransform: textData.textTransform,
                    whiteSpace: textData.whiteSpace,
                    wordBreak: textData.wordBreak,
                }}>
                    {pageNumbHelper && type && type === 'PageNumber' ? pageNumbHelper : textData.content}
                </p>
            )}
        </div>
    );
});

const styles = {
    EditableTextCont: {
        alignItems: 'center',
        display: 'flex',
        height: '100%',
        width: '100%'
    } as React.CSSProperties,
    text: {
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'transparent',
        padding: '0px',
        margin: '0px'
    } as React.CSSProperties,
    textareaStyle: {
        margin: '0px',
        padding: '0px',
        width: '100%',
        border: 'none',
        outline: 'none',
        resize: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
    } as React.CSSProperties,
};

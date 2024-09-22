import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Text } from "../../types/whiteBoard";

interface EditableTextProps {
  textData: Text;
  isEditing: boolean;
  onChange: (newValue: string) => void;
  onFocus: () => void;
  onBlur: (event: React.FocusEvent) => void;
  type?: string;
  pageNumbHelper?: number;
  order?: number;
  marker?: string
}

export const EditableText: React.FC<EditableTextProps> = observer(({ textData, isEditing, onChange, onFocus, onBlur, type, pageNumbHelper, order, marker }) => {
  const editableDivRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (editableDivRef.current) {
      editableDivRef.current.innerHTML = textData.content; // Ensure the initial content is set
    }
  }, [textData.content]);

  const handleFocus = () => {
    onFocus();
    setFocused(true);
  };

  useEffect(() => {
    if (isEditing === false) {
      setFocused(false);
    }
    if (editableDivRef.current) {
      onChange(editableDivRef.current.innerHTML);
    }
  }, [editableDivRef.current?.innerHTML, isEditing]);

  return (
    <div style={styles.EditableTextCont}>
      {marker && <i style={{
        fontSize: textData.fontSize,
        fontStyle: textData.fontStyle,
        color: textData.color,
        marginBottom: '2px'
      }} className={marker}></i>}
      <p
        style={{
          ...styles.number,
          display: type !== "List" ? "none" : "",
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
        }}
      >
        {order && `${order}-`}{" "}
      </p>
      {type !== "PageNumber" && (
        <div
          ref={editableDivRef}
          contentEditable={isEditing}
          onFocus={handleFocus}
          onBlur={() => setFocused(false)}
          style={{
            ...styles.contentEditableDiv,
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
            boxShadow: focused ? "inset 0 0 0 1px blue" : "none",
            backgroundColor: "transparent",
            cursor: isEditing ? "text" : "pointer",
          }}
        ></div>
      )}
      {pageNumbHelper && type && type === "PageNumber" && (
        <p
          style={{
            ...styles.pageNumber,
            fontSize: textData.fontSize,
            fontWeight: textData.fontWeight,
            fontStyle: textData.fontStyle,
            color: textData.color,
            textDecoration: textData.textDecoration,
            textAlign: "center",
            justifyContent: textData.textAlign,
            letterSpacing: textData.letterSpacing,
            lineHeight: textData.lineHeight,
            fontFamily: textData.fontFamily,
            textTransform: textData.textTransform,
            whiteSpace: textData.whiteSpace,
            wordBreak: textData.wordBreak,
          }}
        >
          {pageNumbHelper}
        </p>
      )}
    </div>
  );
});

const styles = {
  EditableTextCont: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    width: "100%",
  } as React.CSSProperties,
  number: {
    padding: "0px",
    margin: "0px",
  } as React.CSSProperties,
  contentEditableDiv: {
    width: "100%",
    border: "none",
    outline: "none",
    overflow: "hidden",
    boxSizing: "border-box",
    backgroundColor: "transparent",
  } as React.CSSProperties,
  pageNumber: {
    width: "100%",
  } as React.CSSProperties,
};

import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Text } from "../../types/whiteBoard";
import { ColorSelectorForConts } from "./ColorSelectorForConts";
import TextEditButton from "./UnifiedTextEditorButton";

interface TextEditorBarProps {
  content: Text;
  onChange: (updatedContent: Partial<Text>) => void;
}

export const TextEditorBar: React.FC<TextEditorBarProps> = observer(({ content, onChange }) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);
  const [showLetterSpacing, setShowLetterSpacing] = useState(false);
  const [showLineHeight, setShowLineHeight] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange({ [name]: name === "fontSize" || name === "letterSpacing" ? `${value}px` : value });
  };

  const handleOptionClick = (name: keyof Text, value: string) => {
    onChange({ [name]: value });
  };

  const toggleOption = (name: keyof Text, value1: string, value2: string) => {
    onChange({ [name]: content[name] === value1 ? value2 : value1 });
  };

  const increaseFontSize = () => {
    const currentSize = parseInt(content.fontSize) || 0;
    onChange({ fontSize: `${currentSize + 2}px` });
  };

  const decreaseFontSize = () => {
    const currentSize = parseInt(content.fontSize) || 0;
    onChange({ fontSize: `${Math.max(currentSize - 2, 0)}px` });
  };

  const increaseLetterSpacing = () => {
    const currentSpacing = parseFloat(content.letterSpacing) || 0;
    onChange({ letterSpacing: `${currentSpacing + 2}px` });
  };

  const decreaseLetterSpacing = () => {
    const currentSpacing = parseFloat(content.letterSpacing) || 0;
    onChange({ letterSpacing: `${Math.max(currentSpacing - 2, 0)}px` });
  };

  const increaseLineHeight = () => {
    const currentSpacing = parseFloat(content.lineHeight) || 0;
    onChange({ lineHeight: `${currentSpacing + 2}` });
  };

  const decreaseLineHeight = () => {
    const currentSpacing = parseFloat(content.lineHeight) || 0;
    onChange({ lineHeight: `${Math.max(currentSpacing - 2, 0)}` });
  };

  const handleTextColorChange = (color: any) => {
    onChange({ color: color });
  };

  const handleBackgroundColorChange = (color: any) => {
    onChange({ backgroundColor: color });
  };

  return (
    <div id="TextEditorBar" style={styles.EditTextBarCont}>
      <select name="fontFamily" value={content.fontFamily} onChange={handleInputChange} style={{ ...styles.input, width: "100px" }}>
        <option value="Arial, sans-serif">Arial</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="'Georgia', serif">Georgia</option>
        <option value="'Verdana', sans-serif">Verdana</option>
        <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
        <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
      </select>

      <div style={{ width: "24px", backgroundColor: "rgb(245, 245, 245)", transform: showTextColorPicker ? "scale(1)" : "" }} className="textEditButton">
        <i onClick={() => setShowTextColorPicker(!showTextColorPicker)} style={{ marginLeft: "4px", color: content.color }} className="fa fa-font"></i>
        <div onClick={() => setShowTextColorPicker(!showTextColorPicker)} style={{ ...styles.box, width: "100%", height: "6px", padding: "0px", backgroundColor: content.color }} />
        {showTextColorPicker && (
          <div style={styles.picker}>
            <ColorSelectorForConts color={content.color} onChange={(color) => handleTextColorChange(color)} setShow={setShowTextColorPicker} />
          </div>
        )}
      </div>

      <div style={{ ...styles.box, backgroundColor: content.backgroundColor, height: "24px", width: "24px", transform: showBackgroundColorPicker ? "scale(1)" : "" }} className="textEditButton">
        <i onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)} style={{ marginLeft: "-1px", color: content.color }} className="fa fa-font"></i>
        {showBackgroundColorPicker && (
          <div style={styles.picker}>
            <ColorSelectorForConts color={content.backgroundColor} onChange={(color) => handleBackgroundColorChange(color)} setShow={setShowBackgroundColorPicker} />
          </div>
        )}
      </div>

      <div style={styles.boxWihtInput}>
        <button
          onClick={decreaseFontSize}
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor as string)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor as string)}
        >
          <i className="fa fa-minus"></i>
        </button>
        <input type="number" name="fontSize" value={parseFloat(content.fontSize)} onChange={handleInputChange} placeholder="font Size" style={styles.input} />
        <button
          onClick={increaseFontSize}
          style={styles.button}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor as string)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor as string)}
        >
          <i className="fa fa-plus"></i>
        </button>
      </div>

      <div>|</div>

      <TextEditButton
        option="fontWeight"
        value="bold"
        description={"Bold text"}
        currentValue={content.fontWeight}
        iconClass="fa fa-bold"
        onClick={() => {
          const selectedText = window.getSelection()?.toString();
          if (selectedText) {
            document.execCommand("bold");
          } else {
            toggleOption("fontWeight", "normal", "bold");
          }
        }}
      />

      <TextEditButton
        option="fontStyle"
        value="italic"
        description={"Italic text"}
        currentValue={content.fontStyle}
        iconClass="fa fa-italic"
        onClick={() => {
          const selectedText = window.getSelection()?.toString();
          if (selectedText) {
            document.execCommand("italic");
          } else {
            toggleOption("fontStyle", "normal", "italic");
          }
        }}
      />

      <div>|</div>

      <TextEditButton
        option="textAlign"
        value="left"
        description={"Left text align"}
        currentValue={content.textAlign}
        iconClass="fa fa-align-left"
        onClick={() => handleOptionClick("textAlign", "left")}
      />

      <TextEditButton
        option="textAlign"
        value="center"
        description={"Center text align"}
        currentValue={content.textAlign}
        iconClass="fa fa-align-center"
        onClick={() => handleOptionClick("textAlign", "center")}
      />

      <TextEditButton
        option="textAlign"
        value="right"
        description={"Right text align"}
        currentValue={content.textAlign}
        iconClass="fa fa-align-right"
        onClick={() => handleOptionClick("textAlign", "right")}
      />

      <TextEditButton
        option="textAlign"
        value="justify"
        description={"Justify text align"}
        currentValue={content.textAlign}
        iconClass="fa fa-align-justify"
        onClick={() => handleOptionClick("textAlign", "justify")}
      />

      <div>|</div>

      <TextEditButton
        option="textDecoration"
        value="underline"
        currentValue={content.textDecoration}
        description={"Underline"}
        toggleValue="none"
        iconClass="fa fa-underline"
        onClick={() => {
          const selectedText = window.getSelection()?.toString();
          if (selectedText) {
            document.execCommand("underline");
          } else {
            content.textDecoration !== "underline" ? handleOptionClick("textDecoration", "underline") : handleOptionClick("textDecoration", "none");
          }
        }}
      />
      <TextEditButton
        option="textDecoration"
        value="line-through"
        currentValue={content.textDecoration}
        description={"Line-through"}
        toggleValue="none"
        iconClass="fa fa-strikethrough"
        onClick={() => {
          const selectedText = window.getSelection()?.toString();
          if (selectedText) {
            document.execCommand("strikethrough");
          } else {
            content.textDecoration !== "line-through" ? handleOptionClick("textDecoration", "line-through") : handleOptionClick("textDecoration", "none");
          }
        }}
      />
      {/*<div
        style={styles.box}
        onClick={() => {
          content.textDecoration !== 'overline'
            ? handleOptionClick('textDecoration', 'overline')
            : handleOptionClick('textDecoration', 'none')
        }} className="textEditButton"
      >
        <i className="fa fa-strikethrough"></i>
      </div>*/}

      <div>|</div>

      <div>
        <TextEditButton
          option="textAlign"
          value="none1"
          description={"Change letter spacting"}
          currentValue={"none"}
          iconClass="fa fa-text-width"
          onClick={() => {
            setShowLetterSpacing(!showLetterSpacing);
            setShowLineHeight(false);
          }}
        />
        {showLetterSpacing && (
          <div style={{ ...styles.boxWihtInput, ...styles.hiddenInput }}>
            <button
              onClick={decreaseLetterSpacing}
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor as string)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor as string)}
            >
              <i className="fa fa-minus"></i>
            </button>
            <input
              className="noArrowInput"
              type="number"
              name="letterSpacing"
              value={parseFloat(content.letterSpacing)}
              onChange={handleInputChange}
              placeholder="letter Spacing"
              style={styles.input}
            />
            <button
              onClick={increaseLetterSpacing}
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor as string)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor as string)}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        )}
      </div>

      <div>
        <TextEditButton
          option="textAlign"
          value="none1"
          description={"Change text height"}
          currentValue={"none"}
          iconClass="fa fa-text-height"
          onClick={() => {
            setShowLineHeight(!showLineHeight);
            setShowLetterSpacing(false);
          }}
        />

        {showLineHeight && (
          <div style={{ ...styles.boxWihtInput, ...styles.hiddenInput }}>
            <button
              onClick={decreaseLineHeight}
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor as string)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor as string)}
            >
              <i className="fa fa-minus"></i>
            </button>
            <input
              className="noArrowInput"
              type="number"
              name="lineHeight"
              value={parseFloat(content.lineHeight)}
              onChange={handleInputChange}
              placeholder="Line Height"
              step="0.1"
              style={styles.input}
            />
            <button
              onClick={increaseLineHeight}
              style={styles.button}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor as string)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = styles.button.backgroundColor as string)}
            >
              <i className="fa fa-plus"></i>
            </button>
          </div>
        )}
      </div>

      <div>|</div>
      <TextEditButton
        option="textTransform"
        value="none"
        currentValue={content.textTransform}
        description={"Default text casing"}
        onClick={() => handleOptionClick("textTransform", "none")}
        text="Tt"
      />
      <TextEditButton
        option="textTransform"
        value="uppercase"
        currentValue={content.textTransform}
        description={"All text upper-case"}
        onClick={() => handleOptionClick("textTransform", "uppercase")}
        text="TT"
      />
      <TextEditButton
        option="textTransform"
        value="lowercase"
        currentValue={content.textTransform}
        description={"All text lower-case"}
        onClick={() => handleOptionClick("textTransform", "lowercase")}
        text="tt"
      />
    </div>
  );
});

const styles = {
  EditTextBarCont: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderBottomRightRadius: "15px",
    borderBottomLeftRadius: "15px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    gap: "10px",
    width: "100%",
    position: "fixed",
    cursor: "pointer",
    justifyContent: "center",
    left: "0px",
    top: 50,
    height: "32px",
    zIndex: "2000",
  } as React.CSSProperties,
  box: {
    padding: "5px",
    borderRadius: "4px",
    boxShadow: "0 0px 2px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  boxHover: {} as React.CSSProperties,
  boxWihtInput: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  } as React.CSSProperties,
  hiddenInput: {
    position: "absolute",
    top: "32px",
    padding: "8px",
    transform: "translateX(-39%)",
    borderRadius: "4px",
    backgroundColor: "#fff",
  } as React.CSSProperties,
  input: {
    width: "50px",
    padding: "5px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    textAlign: "center",
  } as React.CSSProperties,
  button: {
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    padding: "5px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  } as React.CSSProperties,
  buttonHover: {
    backgroundColor: "#0056b3",
  } as React.CSSProperties,
  picker: {
    position: "absolute",
    top: "33px",
    left: "-40px",
    zIndex: 2,
    backgroundColor: "#fff",
    padding: "2px",
    boxShadow: "0 1px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: "4px",
  } as React.CSSProperties,
};

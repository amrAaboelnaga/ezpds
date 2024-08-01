import React, { useEffect, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { observer } from 'mobx-react-lite';
import { Text } from '../../types/whiteBoard';
import { ColorSelectorForConts } from './ColorSelectorForConts';

interface TextEditorBarProps {
  content: Text;
  onChange: (updatedContent: Partial<Text>) => void;
}

export const TextEditorBar: React.FC<TextEditorBarProps> = observer(({ content, onChange }) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showBackgroundColorPicker, setShowBackgroundColorPicker] = useState(false);


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    onChange({ [name]: name === 'fontSize' || name === 'letterSpacing' ? `${value}px` : value });
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


  const handleTextColorChange = (color: any) => {
    onChange({ color: color });
  };

  const handleBackgroundColorChange = (color: any) => {
    onChange({ backgroundColor: color });
  };

  return (
    <div id="TextEditorBar" style={styles.EditTextBarCont}>
      <div style={{ ...styles.box, backgroundColor: content.color }} onClick={() => setShowTextColorPicker(!showTextColorPicker)}></div>
      {showTextColorPicker && (
        <div style={styles.picker}>
          <ColorSelectorForConts color={content.color} onChange={(color) => handleTextColorChange(color)} setShow={setShowTextColorPicker} />
        </div>
      )}

      <div style={{ ...styles.box, backgroundColor: content.backgroundColor }} onClick={() => setShowBackgroundColorPicker(!showBackgroundColorPicker)}></div>
      {showBackgroundColorPicker && (
        <div style={styles.picker}>
          <ColorSelectorForConts color={content.backgroundColor} onChange={(color) => handleBackgroundColorChange(color)} setShow={setShowBackgroundColorPicker} />
        </div>
      )}

      <div style={styles.boxWihtInput}>
        <p>Size</p>
        <button onClick={decreaseFontSize} style={styles.button}>-</button>
        <span>{parseInt(content.fontSize) || 0}px</span>
        <button onClick={increaseFontSize} style={styles.button}>+</button>
      </div>

      <div style={styles.boxWihtInput}>
        <p>Spacing</p>
        <button onClick={decreaseLetterSpacing} style={styles.button}>-</button>
        <span>{parseFloat(content.letterSpacing) || 0}px</span>
        <button onClick={increaseLetterSpacing} style={styles.button}>+</button>
      </div>

      <div style={styles.box} onClick={() => toggleOption('fontWeight', 'normal', 'bold')}>B</div>
      <div style={styles.box} onClick={() => toggleOption('fontStyle', 'normal', 'italic')}>I</div>
      ||
      <div style={styles.box} onClick={() => handleOptionClick('textAlign', 'left')}>L</div>
      <div style={styles.box} onClick={() => handleOptionClick('textAlign', 'center')}>C</div>
      <div style={styles.box} onClick={() => handleOptionClick('textAlign', 'right')}>R</div>
      <div style={styles.box} onClick={() => handleOptionClick('textAlign', 'justify')}>J</div>
      ||
      <div style={styles.box} onClick={() => handleOptionClick('textDecoration', 'none')}>N</div>
      <div style={styles.box} onClick={() => handleOptionClick('textDecoration', 'underline')}>U</div>
      <div style={styles.box} onClick={() => handleOptionClick('textDecoration', 'overline')}>O</div>
      <div style={styles.box} onClick={() => handleOptionClick('textDecoration', 'line-through')}>L</div>
      ||
      <div style={styles.boxWihtInput}>
        <p>Height</p>
        <input
          type="number"
          name="lineHeight"
          value={parseFloat(content.lineHeight)}
          onChange={handleInputChange}
          placeholder="Line Height"
          step="0.1"
          style={styles.input}
        />
      </div>

      <select
        name="fontFamily"
        value={content.fontFamily}
        onChange={handleInputChange}
        style={{ ...styles.input, width: '100px' }}
      >
        <option value="Arial, sans-serif">Arial</option>
        <option value="'Times New Roman', serif">Times New Roman</option>
        <option value="'Courier New', monospace">Courier New</option>
        <option value="'Georgia', serif">Georgia</option>
        <option value="'Verdana', sans-serif">Verdana</option>
        <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
        <option value="'Comic Sans MS', cursive">Comic Sans MS</option>
      </select>

      <div style={styles.box} onClick={() => handleOptionClick('textTransform', 'none')}>N</div>
      <div style={styles.box} onClick={() => handleOptionClick('textTransform', 'capitalize')}>C</div>
      <div style={styles.box} onClick={() => handleOptionClick('textTransform', 'uppercase')}>U</div>
      <div style={styles.box} onClick={() => handleOptionClick('textTransform', 'lowercase')}>L</div>
    </div>
  );
});

const styles = {
  EditTextBarCont: {
    display: 'flex',
    position: 'fixed',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    right: 0,
    top: 50,
    width: '85%',
    height: '50px',
    backgroundColor: 'grey',
    gap: '10px',
    zIndex: '2000'
  } as React.CSSProperties,
  box: {
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid black',
    cursor: 'pointer',
  } as React.CSSProperties,
  boxWihtInput: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  } as React.CSSProperties,
  lable: {

  } as React.CSSProperties,
  input: {
    height: '30px',
    width: '30px',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '5px'
  } as React.CSSProperties,
  button: {
    width: '30px',
    height: '30px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    backgroundColor: '#f0f0f0',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
    lineHeight: '1',
  } as React.CSSProperties,
  picker: {
    position: 'absolute',
    top: '50px',
    left: '0px',
    zIndex: 2,
  } as React.CSSProperties,
};

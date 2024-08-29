import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ColorSelectorForConts } from './ColorSelectorForConts';
import { DraggableItemInterface } from '../../types/whiteBoard';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { rootStore } from '../../stores/rootStore';
import ContainerEditorSingleButton from './ContainerEditorSingleButton';

import borderPlus from "../../assets/images/svg/border-inner-svgrepo-com.svg";
import borderMinus from "../../assets/images/svg/border-horizontal-svgrepo-com.svg";
import paddingImage from "../../assets/images/svg/padding-svgrepo-com.svg";
import borderRadiusImage from "../../assets/images/svg/radius-upright-svgrepo-com.svg";
import opacityImage from "../../assets/images/svg/opacity-svgrepo-com.svg"

import colAdd from "../../assets/images/svg/column-add-line-svgrepo-com.svg";
import colRem from "../../assets/images/svg/column-remove-line-svgrepo-com.svg";
import RowAdd from "../../assets/images/svg/add-line-row-svgrepo-com.svg";
import RowRem from "../../assets/images/svg/line-row-remove-svgrepo-com.svg"

import verSpaceAdd from "../../assets/images/svg/spacing-width-01-svgrepo-com.svg"
import verSpaceRem from "../../assets/images/svg/spacing-horizontal-svgrepo-com.svg"
import horzSpaceAdd from "../../assets/images/svg/spacing-height-01-svgrepo-com.svg"
import horzSpaceRem from "../../assets/images/svg/spacing-vertical-svgrepo-com.svg"


interface ContainerEditorProps {
  data: any;
  standardSpecs: DraggableItemInterface;
}

const ContainerEditor: React.FC<ContainerEditorProps> = ({ data, standardSpecs }) => {
  const { whiteBoardStore } = rootStore;
  const { borderColor, backgroundColor, type } = standardSpecs;
  const { useUpdateStandards, useEditStandards } = useWhiteBoardHandlers();
  const [showBackgroundColorBox, setShowBackgroundColorBox] = useState(false);
  const [showBorderColorBox, setShowBorderColorBox] = useState(false);
  const updateStandards = useUpdateStandards();
  const editStandards = useEditStandards(data.pageId, data.id, standardSpecs, updateStandards);

  const handleBackgroundColorChange = (color: string) => {
    updateStandards(data.pageId, data.id, undefined, undefined, undefined, undefined, undefined, color);
  };

  const handleBorderColorChange = (color: string) => {
    updateStandards(data.pageId, data.id, undefined, undefined, color, undefined);
  };

  const handleRepeateState = () => {
    updateStandards(data.pageId, data.id, undefined, undefined, undefined, undefined, undefined, undefined, undefined, !standardSpecs.repeate);
    try {
      if (data.pageId !== 0) {
        const id = `Repeated-${type}-${Object.keys(whiteBoardStore.pages[0]?.jsonSpecs || {}).length}`;
        const newRepeatable = { [id]: whiteBoardStore.pages[data.pageId].jsonSpecs[data.id] };
        whiteBoardStore.addObjectToPage(0, newRepeatable);
        data.deleteItem();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const shouldRenderLine = (type: string): boolean => {
    return type !== 'Text' && type !== 'Rectangle' && type !== 'Circle' && type !== 'Triangle';
  };
  return (
    <div style={styles.container}>
      <div style={styles.editStandardsContainer}>
        <ContainerEditorSingleButton onClick={() => editStandards('border', 'increase')} imageSrc={borderPlus} description="Increase Border" />
        <ContainerEditorSingleButton onClick={() => editStandards('border', 'decrease')} imageSrc={borderMinus} description="Decrease Border" />
        <ContainerEditorSingleButton onClick={() => editStandards('padding', 'increase')} iconClass="fa fa-plus" imageSrc={paddingImage} description="Increase Padding" />
        <ContainerEditorSingleButton onClick={() => editStandards('padding', 'decrease')} iconClass="fa fa-minus" imageSrc={paddingImage} description="Decrease Padding" />
        {!data.isCircle && (
          <>
            <ContainerEditorSingleButton onClick={() => editStandards('borderRadius', 'increase')} iconClass="fa fa-plus" imageSrc={borderRadiusImage} description="Increase Border Radius" />
            <ContainerEditorSingleButton onClick={() => editStandards('borderRadius', 'decrease')} iconClass="fa fa-minus" imageSrc={borderRadiusImage} description="Decrease Border Radius" />
          </>
        )}
        <ContainerEditorSingleButton onClick={() => editStandards('opacity', 'decrease')} iconClass="fa fa-plus" imageSrc={opacityImage} description="Increase Opacity" />
        <ContainerEditorSingleButton onClick={() => editStandards('opacity', 'increase')} iconClass="fa fa-minus" imageSrc={opacityImage} description="Decrease Opacity" />
        <ContainerEditorSingleButton onClick={() => editStandards('zIndex', 'increase')} iconClass="fa fa-arrow-up" description="Bring Forward" />
        <ContainerEditorSingleButton onClick={() => editStandards('zIndex', 'decrease')} iconClass="fa fa-arrow-down" description="Send Backward" />
        {shouldRenderLine(standardSpecs.type) && <button
          style={{ ...styles.button, color: backgroundColor, backgroundColor: backgroundColor || 'transparent', border: `1px solid ${borderColor}` }}
        > <ContainerEditorSingleButton
            onClick={() => setShowBackgroundColorBox((prev) => !prev)}
            description="Set Background Color"
          /></button>}
        <button
          style={{ ...styles.button, color: backgroundColor, backgroundColor: backgroundColor, border: `5px solid ${borderColor}` }}
        ><ContainerEditorSingleButton
            onClick={() => setShowBorderColorBox((prev) => !prev)}
            description="Set Border Color"
          /></button>
      </div>
      <div style={styles.line} />
      <div style={styles.actionButtonsContainer}>
        {data.orderedList && <ContainerEditorSingleButton onClick={data.orderedList} iconClass="fa fa-list-ol" description="Ordered List" />}
        {data.colIncrease && <ContainerEditorSingleButton onClick={data.colIncrease} imageSrc={colAdd} description="Increase Columns" />}
        {data.colDecrease && <ContainerEditorSingleButton onClick={data.colDecrease} imageSrc={colRem} description="Decrease Columns" />}
        {data.rowIncrease && <ContainerEditorSingleButton onClick={data.rowIncrease} imageSrc={RowAdd} description="Increase Rows" />}
        {data.rowDecrease && <ContainerEditorSingleButton onClick={data.rowDecrease} imageSrc={RowRem} description="Decrease Rows" />}
        {data.gapIncrease && <ContainerEditorSingleButton onClick={data.gapIncrease} imageSrc={verSpaceAdd} description="Increase Vertical Gap" />}
        {data.gapDecrease && <ContainerEditorSingleButton onClick={data.gapDecrease} imageSrc={verSpaceRem} description="Decrease Vertical Gap" />}
        {data.rowGapIncrease && <ContainerEditorSingleButton onClick={data.rowGapIncrease} imageSrc={horzSpaceAdd} description="Increase Horizontal Gap" />}
        {data.rowGapDecrease && <ContainerEditorSingleButton onClick={data.rowGapDecrease} imageSrc={horzSpaceRem} description="Decrease Horizontal Gap" />}
        {data.addImg && <ContainerEditorSingleButton onClick={data.addImg} iconClass="fa fa-image" description="Add Image" />}
      </div>
      {shouldRenderLine(standardSpecs.type) && (
        <div style={styles.line} />
      )}
      <div style={{ height: '0px' }} />
      <div style={styles.editStandardsContainer}>
        <ContainerEditorSingleButton onClick={handleRepeateState} iconClass="fa fa-repeat" description="Repeat on all pages" />
        {data.deleteItem && <ContainerEditorSingleButton onClick={data.deleteItem} iconClass="fa fa-trash" description="Delete Item" />}
      </div>
      {showBorderColorBox && (
        <div style={styles.colorBoxWrapper}>
          <ColorSelectorForConts color={borderColor} onChange={handleBorderColorChange} setShow={setShowBorderColorBox} />
        </div>
      )}
      {showBackgroundColorBox && (
        <div style={styles.colorBoxWrapper}>
          <ColorSelectorForConts color={backgroundColor} onChange={handleBackgroundColorChange} setShow={setShowBackgroundColorBox} />
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    zIndex: 900,
    overflow: 'visible',
    width: '220px',
    backgroundColor: 'rgb(245, 245, 245)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px 5px',
    borderRadius: '8px',
    border: '1px solid grey'
  } as React.CSSProperties,
  editStandardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
    justifyContent: 'center',
  } as React.CSSProperties,
  actionButtonsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    width: '100%',
    justifyContent: 'center',
  } as React.CSSProperties,
  button: {
    margin: '0px 0px',
    width: '25px',
    height: '25px',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s, transform 0.3s',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: '16px',
    color: '#333',
    position: 'relative',
    zIndex: 1,
  } as React.CSSProperties,
  colorBoxWrapper: {
    position: 'absolute',
    top: '0',
    right: '-200px',
    zIndex: 1000,
  } as React.CSSProperties,
  line: {
    width: '100%',
    height: '1px',
    backgroundColor: 'black'
  } as React.CSSProperties,
};

export default observer(ContainerEditor);

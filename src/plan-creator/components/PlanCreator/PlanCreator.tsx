import FourBurner from "@/plan-creator/components-blocks/FourBurner/FourBurner";
import TwoBurner from "@/plan-creator/components-blocks/TwoBurner/TwoBurner";
import LineHighlighter from "@/plan-creator/components-light/LineHighlighter/LineHighlighter";
import PlanContainer from "@/plan-creator/components-light/PlanContainer/PlanContainer";
import SelectionBox from "@/plan-creator/components-light/SelectionBox/SelectionBox";
import Block from "@/plan-creator/enums/block.enum";
import useBlocks from "@/plan-creator/hooks/useBlocks";
import useMouseSelection from "@/plan-creator/hooks/useMouseSelection";
import IBlock from "@/plan-creator/types/block.interface";
import IIndex from "@/plan-creator/types/index.interface";
import { editorSettingsState } from "@/redux/store";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Grid } from "@mui/material";
import { MouseEvent, useCallback, useState } from "react";
import { useSelector } from "react-redux";

import Arrow from "../../components-blocks/Arrow/Arrow";
import Door from "../../components-blocks/Door/Door";
import DraggableBlock from "../DraggableBlock/DraggableBlock";
import ResizeDialog from "../ResizeDialog/ResizeDialog";

const PlanCreator = () => {
  const { pixelRatio, planDimensions } = useSelector(editorSettingsState);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 0.01,
    },
  });
  const [resizeBlock, setResizeBlock] = useState<IBlock & IIndex>();
  const [isResizeDialogOpen, setIsResizeDialogOpen] = useState(false);
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);
  const sensors = useSensors(
    mouseSensor,
    touchSensor,
    keyboardSensor,
    pointerSensor
  );
  const {
    isDragging,
    blocks,
    highlightLines,
    selectedBlocks,
    handleBlockSelect,
    handleBlockSwapDimensionsByIndex,
    handleBlockRotateNinteyByIndex,
    handleSelectedBlocksReset,
    handleBlockMultiSelect,
    handleBlockDragMove,
    handleBlockDragStart,
    handleBlockDragEnd,
    handleBlockResize,
  } = useBlocks();
  const {
    coordinates,
    isSelecting,
    handleSelectionMouseDown,
    handleSelectionMouseMove,
    handleSelectionMouseUp,
  } = useMouseSelection();

  const handleMouseUp = (_e: MouseEvent<HTMLDivElement>) =>
    handleSelectionMouseUp(handleBlockMultiSelect);

  const handleResizeDialogClose = () => setIsResizeDialogOpen(false);

  const handleResizeDialogOpen = useCallback(
    (i: number) => {
      setResizeBlock({ ...blocks[i], index: i });
      setIsResizeDialogOpen(true);
    },
    [blocks]
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleBlockDragEnd}
      onDragMove={handleBlockDragMove}
      onDragStart={handleBlockDragStart}
      autoScroll={{ layoutShiftCompensation: false }}
    >
      <div
        onClick={handleSelectedBlocksReset}
        onMouseDown={handleSelectionMouseDown}
        onMouseMove={handleSelectionMouseMove}
        onMouseUp={handleMouseUp}
      >
        <PlanContainer>
          {blocks.map((block, i) => (
            <DraggableBlock
              isDropped
              index={i}
              isDragDisabled={selectedBlocks.length > 1}
              isOneSelected={selectedBlocks.length === 1}
              isSelected={selectedBlocks.some((s) => s.id === block.id)}
              key={block.id + block.type}
              block={block}
              onClick={() => handleBlockSelect(block.id)}
              onSwapDimensionsClick={() => handleBlockSwapDimensionsByIndex(i)}
              onRotateNinetyClick={() => handleBlockRotateNinteyByIndex(i)}
              onResizeClick={() => handleResizeDialogOpen(i)}
            />
          ))}
          {highlightLines.map(({ line, block }) => (
            <LineHighlighter key={block.id} direction={line} block={block} />
          ))}
        </PlanContainer>
        {isSelecting && !isDragging ? <SelectionBox {...coordinates} /> : null}
        <Grid container mt={4}>
          <DraggableBlock
            block={{
              id: "fryer2ebaa",
              name: "test",
              dimensions: {
                width: 25,
                length: 25,
              },
              displayDimensions: {
                width: 25,
                length: 25,
              },
              label: "CUSTOM WHATEVER",
              type: Block.IMAGE,
            }}
          />

          <DraggableBlock
            block={{
              id: "empty",
              name: "test",
              dimensions: {
                width: 25,
                length: 45,
              },
              displayDimensions: {
                width: 25,
                length: 45,
              },
              type: Block.BORDERLESS,
              label: "EMPTY",
            }}
          />
          <DraggableBlock
            block={{
              id: "two-burners",
              name: "test",
              dimensions: {
                width: 12,
                length: 30,
              },
              displayDimensions: {
                width: 12,
                length: 30,
              },
              type: Block.COMPONENT,
              component: TwoBurner,
            }}
          />
          <DraggableBlock
            block={{
              id: "four-burners",
              name: "test",
              dimensions: {
                width: 25,
                length: 35,
              },
              displayDimensions: {
                width: 25,
                length: 35,
              },
              type: Block.COMPONENT,
              component: FourBurner,
            }}
          />
          <DraggableBlock
            block={{
              id: "four-burneqwrs",
              name: "test",
              dimensions: {
                width: 13,
                length: 15,
              },
              displayDimensions: {
                width: 13,
                length: 15,
              },
              type: Block.COMPONENT,
              component: FourBurner,
            }}
          />
          <Grid item p={2} />
          <DraggableBlock
            block={{
              id: "four-burs",
              name: "test",
              dimensions: {
                width: 25,
                length: 25,
              },
              displayDimensions: {
                width: 25,
                length: 25,
              },
              type: Block.COMPONENT,
              component: Door,
              isBorderless: true,
            }}
          />
          <DraggableBlock
            block={{
              id: "four-burnerewqs",
              name: "test",
              dimensions: {
                width: 18,
                length: 35,
              },
              displayDimensions: {
                width: 25,
                length: 35,
              },
              type: Block.COMPONENT,
              component: Door,
              isBorderless: true,
            }}
          />
          <DraggableBlock
            block={{
              id: "four-burnerewqads",
              name: "test",
              dimensions: {
                width: 18,
                length: 35,
              },
              displayDimensions: {
                width: 18,
                length: 35,
              },
              type: Block.COMPONENT,
              component: Arrow,
              isBorderless: true,
              isArrowsDisabled: true,
              isLabelDisabled: true,
              isOneDimension: true,
            }}
          />
          <DraggableBlock
            block={{
              id: "four-burnerewqadsasd",
              name: "test",
              dimensions: {
                width: 18,
                length: 60,
              },
              displayDimensions: {
                width: 24,
                length: 24,
              },
              type: Block.COMPONENT,
              component: Arrow,
              isBorderless: true,
              isArrowsDisabled: true,
              isLabelDisabled: true,
              isOneDimension: true,
            }}
          />
          <DraggableBlock
            block={{
              id: "four-burnerewqadsadds",
              name: "test",
              dimensions: {
                width: 18,
                length: 60,
              },
              displayDimensions: {
                width: 18,
                length: 60,
              },
              type: Block.COMPONENT,
              component: Arrow,
              isBorderless: true,
              isArrowsDisabled: true,
              isLabelDisabled: true,
              isOneDimension: true,
            }}
          />
          {/* <DraggableBlock
              block={{
                id: "dukers-40lb-fryer",
                name: "test",
                dimensions: [14, 14],
                type: Block.IMAGE,
                backgroundImg: DUKERS_40LB_FRYER_IMG,
              }}
            /> */}
        </Grid>
        <ResizeDialog
          open={isResizeDialogOpen}
          block={resizeBlock}
          onClose={handleResizeDialogClose}
          onCloseClick={handleResizeDialogClose}
          onBlockResize={handleBlockResize}
        />
      </div>
    </DndContext>
  );
};

export default PlanCreator;

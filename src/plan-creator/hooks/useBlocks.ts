import { editorSettingsState } from "@/redux/store";
import {
  Active,
  ClientRect,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import Direction from "../enums/direction.enum";
import IBlock from "../types/block.interface";
import ICoordinates from "../types/coordinates.interface";
import IDelta from "../types/delta.interface";
import IDimensions from "../types/dimensions.interface";
import IHightlightLine from "../types/highlight-line.interface";
import ISelectedBlock from "../types/selected-block.interface";
import ISelectionArea from "../types/selection-area.interface";
import { isBlockInSelectionArea, swapBlockDimensions } from "../utility/blocks";
import { generateKey } from "../utility/string";

const useBlocks = () => {
  const isDelayedRef = useRef(false);
  const isMetaPressedRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  const deltaRef = useRef<IDelta>({ x: 0, y: 0 });
  const isResetingSelectedDisabledRef = useRef(false);
  const isMultiSelectDisabledRef = useRef(false);
  const { pixelRatio, highlightSensitivity } = useSelector(editorSettingsState);
  const [isDragging, setIsDragging] = useState(false);
  const [blocks, setBlocks] = useState<IBlock[]>([]);
  const [selectedBlocks, setSelectedBlocks] = useState<ISelectedBlock[]>([]);
  const [highlightLines, setHighlightLines] = useState<IHightlightLine[]>([]);

  const handleSelectedBlocksReset = () => {
    if (!isResetingSelectedDisabledRef.current) {
      setSelectedBlocks([]);
    }
  };

  const handleSelectedBlocksUpdate = () =>
    setSelectedBlocks([...selectedBlocks]);

  const handleBlocksUpdate = () => setBlocks([...blocks]);

  const handleBlockDeleteByIndex = (i: number) => blocks.splice(i, 1);

  const handleEnableMultiSelect = () => {
    setTimeout(() => {
      isMultiSelectDisabledRef.current = false;
    }, 0);
  };

  const handleBlockSwapDimensionsByIndex = (i: number) => {
    swapBlockDimensions(blocks[i]);
    handleBlocksUpdate();
  };

  const handleBlockRotateNinteyByIndex = (i: number) => {
    const { degree = 0 } = blocks[i];
    swapBlockDimensions(blocks[i]);
    if (degree === 270) {
      blocks[i].degree = 0;
    } else {
      blocks[i].degree = degree + 90;
    }

    handleBlocksUpdate();
  };

  const getIsCrossingBoundaries = (
    coordinates: ICoordinates,
    dimensions: IDimensions,
    rect: ClientRect
  ) => {
    const { top, bottom, left, right } = rect;

    if (coordinates.x < left) {
      return true;
    }

    if (coordinates.x + dimensions.length * pixelRatio > right) {
      return true;
    }

    if (coordinates.y < top) {
      return true;
    }

    if (
      coordinates.y + dimensions.width * pixelRatio >
      bottom + window.scrollY
    ) {
      return true;
    }

    return false;
  };

  const getBlockNextCords = (
    block: IBlock,
    delta: IDelta,
    rect: ClientRect
  ) => {
    const { x, y } = delta;
    const blockX = block.coordinates!.x + x;
    const blockY = block.coordinates!.y + y;

    const coordinates: ICoordinates = {
      x: blockX,
      y: blockY,
    };

    if (getIsCrossingBoundaries(coordinates, block.dimensions, rect)) {
      return null;
    }

    block.rect = {
      width: block.dimensions.length * pixelRatio,
      height: block.dimensions.width * pixelRatio,
      left: blockX,
      top: blockY,
      right: blockX + block.dimensions.length * pixelRatio,
      bottom: blockY + block.dimensions.width * pixelRatio,
    };

    return coordinates;
  };

  const handleBlockEnter = (active: Active, rect: ClientRect) => {
    const { left, bottom } = active.rect.current.translated!;
    const blockX = left + window.scrollX;
    const block = active.data.current as IBlock;
    const { dimensions } = block;
    const blockY = bottom - dimensions.width * pixelRatio + window.scrollY;
    const coordinates: ICoordinates = {
      x: blockX,
      y: blockY,
    };

    const shapeRect: ClientRect = {
      width: block.dimensions.length * pixelRatio,
      height: block.dimensions.width * pixelRatio,
      left: blockX,
      top: blockY,
      right: blockX + block.dimensions.length * pixelRatio,
      bottom: blockY + block.dimensions.width * pixelRatio,
    };

    if (getIsCrossingBoundaries(coordinates, dimensions, rect)) {
      return;
    }

    blocks.push({
      ...block,
      id: `${active.id}${generateKey()}`,
      coordinates,
      dimensions,
      rect: shapeRect,
    });
  };

  const handleBlockResize = (i: number, width: number, length: number) => {
    blocks[i].dimensions = { width, length };
    handleBlocksUpdate();
  };

  const handleBlockSelect = (id: string) => {
    isResetingSelectedDisabledRef.current = true;
    const index = blocks.findIndex((s) => id === s.id);
    if (index !== -1) {
      if (isMetaPressedRef.current) {
        if (!selectedBlocks.some((s) => id === s.id)) {
          selectedBlocks.push({ id, index });
          handleSelectedBlocksUpdate();
        }
      } else {
        setSelectedBlocks([{ id, index }]);
      }
    }
    setTimeout(() => {
      isResetingSelectedDisabledRef.current = false;
    }, 0);
  };

  const handleBlockMultiSelect = (coordinates: ISelectionArea) => {
    const { startX, endX, startY, endY } = coordinates;

    if (
      (Math.abs(startX - endX) > 10 || Math.abs(startY - endY) > 10) &&
      !isMultiSelectDisabledRef.current
    ) {
      isResetingSelectedDisabledRef.current = true;
      const filteredBlocks: ISelectedBlock[] = [];

      blocks.forEach((block, index) => {
        if (isBlockInSelectionArea(coordinates, block)) {
          filteredBlocks.push({ id: block.id, index });
        }
      });

      setSelectedBlocks(filteredBlocks);
      setTimeout(() => {
        isResetingSelectedDisabledRef.current = false;
      }, 0);
    }
  };

  const handleUndo = () => {
    // const { current } = eventsRef;
    // current.pop();
    // console.log(eventsRef.current);
    // if (current[current.length - 1]) {
    //   isUndoRef.current = true;
    //   setBlocks(eventsRef.current[current.length - 1]);
    //   setSelectedBlocks([]);
    // } else {
    //   isUndoRef.current = true;
    //   setBlocks([]);
    //   setSelectedBlocks([]);
    // }
  };

  const handleBlockLineHighlights = (active: Active) => {
    const newHighlightLines: IHightlightLine[] = [];
    if (!active.rect.current.translated) {
      return;
    }
    const { left, bottom } = active.rect.current.translated;
    const blockX = left + window.scrollX;
    const block = active.data.current as IBlock;
    const { dimensions } = block;
    const blockY = bottom - dimensions.width * pixelRatio + window.scrollY;

    const rect: ClientRect = {
      width: block.dimensions.length * pixelRatio,
      height: block.dimensions.width * pixelRatio,
      left: blockX,
      top: blockY,
      right: blockX + block.dimensions.length * pixelRatio,
      bottom: blockY + block.dimensions.width * pixelRatio,
    };
    blocks.forEach((b) => {
      // if (selectedBlocks.length > 1) {
      //   if (selectedBlocks.some(({ id }) => id === s.id)) {
      //     return;
      //   }
      // }
      if (b.id !== block?.id && b.rect) {
        if (
          Math.abs(b.rect!.top - rect.top) < highlightSensitivity ||
          Math.abs(b.rect!.top - rect.bottom) < highlightSensitivity
        ) {
          newHighlightLines.push({ line: Direction.TOP, block: b });
        }
        if (
          Math.abs(b.rect!.bottom - rect.top) < highlightSensitivity ||
          Math.abs(b.rect!.bottom - rect.bottom) < highlightSensitivity
        ) {
          newHighlightLines.push({ line: Direction.BOTTOM, block: b });
        }
        if (
          Math.abs(b.rect!.left - rect.left) < highlightSensitivity ||
          Math.abs(b.rect!.left - rect.right) < highlightSensitivity
        ) {
          newHighlightLines.push({ line: Direction.LEFT, block: b });
        }
        if (
          Math.abs(b.rect!.right - rect.left) < highlightSensitivity ||
          Math.abs(b.rect!.right - rect.right) < highlightSensitivity
        ) {
          newHighlightLines.push({ line: Direction.RIGHT, block: b });
        }
      }
    });
    setHighlightLines(newHighlightLines);
  };

  const handleBlockDragStart = (e: DragStartEvent) => {
    deltaRef.current = { x: 0, y: 0 };
    setIsDragging(true);
    activeIdRef.current = e.active.id.toString();

    if (!blocks.some(({ id }) => id === activeIdRef.current)) {
      setSelectedBlocks([]);
    } else if (selectedBlocks.length < 2) {
      handleBlockSelect(activeIdRef.current);
    }
    isDelayedRef.current = false;
    isMultiSelectDisabledRef.current = true;
    setTimeout(() => {
      isDelayedRef.current = true;
    }, 0);
  };

  const handleBlockDragMove = (e: DragMoveEvent) => {
    if (selectedBlocks.length > 1) {
      const { delta, over } = e;
      const updatedDelta = {
        x: delta.x - deltaRef.current.x,
        y: delta.y - deltaRef.current.y,
      };
      deltaRef.current = delta;
      if (over) {
        let movements: { index: number; coordinates: ICoordinates }[] = [];

        for (let i = 0; i < selectedBlocks.length; i++) {
          const newCords = getBlockNextCords(
            blocks[selectedBlocks[i].index],
            updatedDelta,
            over.rect
          );

          if (!newCords) {
            movements = [];
            break;
          }

          movements.push({
            index: selectedBlocks[i].index,
            coordinates: newCords,
          });
        }

        movements.forEach(({ index, coordinates }) => {
          blocks[index].coordinates = coordinates;
        });
      }
    } else {
      setTimeout(() => handleBlockLineHighlights(e.active), 0);
    }
  };

  const handleBlockDragEnd = (e: DragEndEvent) => {
    setIsDragging(false);
    setTimeout(() => setHighlightLines([]), 0);
    const i = blocks.findIndex(({ id }) => id === e.active.id);
    activeIdRef.current = null;
    const { over, delta } = e;

    if (selectedBlocks.length < 2) {
      if (i !== -1) {
        handleEnableMultiSelect();
        if (!isDelayedRef.current) {
          return;
        }

        if (!over) {
          handleBlockDeleteByIndex(i);
          handleBlocksUpdate();
          return;
        }

        const coordinates = getBlockNextCords(blocks[i], delta, over.rect);

        if (coordinates) {
          blocks[i].coordinates = coordinates;
        }
        handleBlocksUpdate();
      } else if (over) {
        handleEnableMultiSelect();
        handleBlockEnter(e.active, over.rect);
        handleBlocksUpdate();
      }
    } else {
      handleEnableMultiSelect();
    }
  };

  const handleDeleteSelectedBlocks = () => {
    if (selectedBlocks.length !== 0) {
      setBlocks(
        blocks.filter((shape) => !selectedBlocks.some((s) => s.id === shape.id))
      );
      handleSelectedBlocksReset();
    }
  };

  const handleDeletePress = (e: KeyboardEvent) => {
    if (
      e.key === "Delete" ||
      e.key === "Backspace" ||
      e.keyCode === 8 ||
      e.keyCode === 46
    ) {
      handleDeleteSelectedBlocks();
    }
  };

  const handleMetaPress = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.key === "Meta" || e.key === "Control") {
      isMetaPressedRef.current = true;
    }
  };

  const handleMetaUp = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.key === "Meta" || e.key === "Control") {
      isMetaPressedRef.current = false;
    }
  };

  const handleAPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "a" && isMetaPressedRef.current) {
      setSelectedBlocks(blocks.map(({ id }, index) => ({ id, index })));
    }
  };

  const handleZPress = (e: KeyboardEvent) => {
    if (e.key.toLowerCase() === "z" && isMetaPressedRef.current) {
      handleUndo();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleZPress);

    return () => {
      document.removeEventListener("keydown", handleZPress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  useEffect(() => {
    document.addEventListener("keydown", handleDeletePress);
    document.addEventListener("keydown", handleMetaPress);
    document.addEventListener("keydown", handleAPress);
    document.addEventListener("keyup", handleMetaUp);

    return () => {
      document.removeEventListener("keydown", handleDeletePress);
      document.removeEventListener("keydown", handleMetaPress);
      document.removeEventListener("keydown", handleAPress);
      document.removeEventListener("keyup", handleMetaUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBlocks]);

  return {
    isDragging,
    blocks,
    highlightLines,
    selectedBlocks,
    handleSelectedBlocksReset,
    handleBlockSelect,
    handleBlockDragMove,
    handleBlockResize,
    handleBlockSwapDimensionsByIndex,
    handleBlockRotateNinteyByIndex,
    handleBlockDeleteByIndex,
    handleBlocksUpdate,
    getIsCrossingBoundaries,
    getBlockNextCords,
    handleBlockMultiSelect,
    handleBlockEnter,
    handleBlockDragStart,
    handleBlockDragEnd,
  };
};

export default useBlocks;

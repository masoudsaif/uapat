import {
  Active,
  ClientRect,
  DragEndEvent,
  DragMoveEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import { SENSITIVITY } from "../constants/options";
import { settingsState } from "../redux/store";
import { Coordinates, Dimensions } from "../types";
import IDelta from "../types/delta.interface";
import IHightlightedLine from "../types/highlighted-line.interface";
import ISelectedShape from "../types/selected-shape.interface";
import ISelectionArea from "../types/selection-area.interface";
import IShape from "../types/shape.interface";
import { isShapeInSelectionArea, swapDimensions } from "../utility/shapes";
import { generateKey } from "../utility/string";
import Direction from "../enums/direction.enum";

const useShapes = () => {
  const isDelayedRef = useRef(false);
  const isMetaPressedRef = useRef(false);
  const activeIdRef = useRef<string | null>(null);
  const deltaRef = useRef<IDelta>({ x: 0, y: 0 });
  const isResetingSelectedDisabledRef = useRef(false);
  const isMultiSelectDisabledRef = useRef(false);
  const { inch } = useSelector(settingsState);
  const [isDragging, setIsDragging] = useState(false);
  const [shapes, setShapes] = useState<IShape[]>([]);
  const [selectedShapes, setSelectedShapes] = useState<ISelectedShape[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<IHightlightedLine[]>(
    []
  );

  const handleSelectedShapesReset = () => {
    if (!isResetingSelectedDisabledRef.current) {
      setSelectedShapes([]);
    }
  };

  const handleSelectedShapesUpdate = () =>
    setSelectedShapes([...selectedShapes]);

  const handleShapesUpdate = () => setShapes([...shapes]);

  const handleShapeDeleteByIndex = (i: number) => shapes.splice(i, 1);

  const handleEnableMultiSelect = () => {
    setTimeout(() => {
      isMultiSelectDisabledRef.current = false;
    }, 0);
  };

  const handleShapeSwapDimensionsByIndex = (i: number) => {
    swapDimensions(shapes[i]);
    handleShapesUpdate();
  };

  const handleShapeRotateNinteyByIndex = (i: number) => {
    const { degree = 0 } = shapes[i];
    swapDimensions(shapes[i]);
    if (degree === 270) {
      shapes[i].degree = 0;
    } else {
      shapes[i].degree = degree + 90;
    }

    handleShapesUpdate();
  };

  const getIsCrossingBoundaries = (
    coordinates: Coordinates,
    dimensions: Dimensions,
    rect: ClientRect
  ) => {
    const { top, bottom, left, right } = rect;

    if (coordinates[0] < left) {
      return true;
    }

    if (coordinates[0] + dimensions[1] * inch > right) {
      return true;
    }

    if (coordinates[1] < top) {
      return true;
    }

    if (coordinates[1] + dimensions[0] * inch > bottom + window.scrollY) {
      return true;
    }

    return false;
  };

  const getShapeNextCords = (
    shape: IShape,
    delta: IDelta,
    rect: ClientRect
  ) => {
    const { x, y } = delta;
    const shapeX = shape.coordinates![0] + x;
    const shapeY = shape.coordinates![1] + y;

    const coordinates: Coordinates = [shapeX, shapeY];

    if (getIsCrossingBoundaries(coordinates, shape.dimensions, rect)) {
      return null;
    }

    shape.rect = {
      width: shape.dimensions[1] * inch,
      height: shape.dimensions[0] * inch,
      left: shapeX,
      top: shapeY,
      right: shapeX + shape.dimensions[1] * inch,
      bottom: shapeY + shape.dimensions[0] * inch,
    };

    return coordinates;
  };

  const handleShapeEnter = (active: Active, rect: ClientRect) => {
    const { left, bottom } = active.rect.current.translated!;
    const shapeX = left + window.scrollX;
    const shape = active.data.current as IShape;
    const { dimensions } = shape;
    const shapeY = bottom - dimensions[0] * inch + window.scrollY;
    const coordinates: Coordinates = [shapeX, shapeY];

    const shapeRect: ClientRect = {
      width: shape.dimensions[1] * inch,
      height: shape.dimensions[0] * inch,
      left: shapeX,
      top: shapeY,
      right: shapeX + shape.dimensions[1] * inch,
      bottom: shapeY + shape.dimensions[0] * inch,
    };

    if (getIsCrossingBoundaries(coordinates, dimensions, rect)) {
      return;
    }

    shapes.push({
      ...shape,
      id: `${active.id}${generateKey()}`,
      coordinates,
      dimensions,
      rect: shapeRect,
    });
  };

  const handleShapeResize = (i: number, w: number, l: number) => {
    shapes[i].dimensions = [w, l];
    handleShapesUpdate();
  };

  const handleShapeSelect = (id: string) => {
    isResetingSelectedDisabledRef.current = true;
    const index = shapes.findIndex((s) => id === s.id);
    if (index !== -1) {
      if (isMetaPressedRef.current) {
        if (!selectedShapes.some((s) => id === s.id)) {
          selectedShapes.push({ id, index });
          handleSelectedShapesUpdate();
        }
      } else {
        setSelectedShapes([{ id, index }]);
      }
    }
    setTimeout(() => {
      isResetingSelectedDisabledRef.current = false;
    }, 0);
  };

  const handleShapeMultiSelect = (coordinates: ISelectionArea) => {
    const { startX, endX, startY, endY } = coordinates;

    if (
      (Math.abs(startX - endX) > 10 || Math.abs(startY - endY) > 10) &&
      !isMultiSelectDisabledRef.current
    ) {
      isResetingSelectedDisabledRef.current = true;
      const filteredShapes: ISelectedShape[] = [];

      shapes.forEach((shape, index) => {
        if (isShapeInSelectionArea(coordinates, shape)) {
          filteredShapes.push({ id: shape.id, index });
        }
      });

      setSelectedShapes(filteredShapes);
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
    //   setShapes(eventsRef.current[current.length - 1]);
    //   setSelectedShapes([]);
    // } else {
    //   isUndoRef.current = true;
    //   setShapes([]);
    //   setSelectedShapes([]);
    // }
  };

  const handleShapeLineHighlights = (active: Active) => {
    const newHighlightedLines: IHightlightedLine[] = [];
    if (!active.rect.current.translated) {
      return;
    }
    const { left, bottom } = active.rect.current.translated;
    const shapeX = left + window.scrollX;
    const shape = active.data.current as IShape;
    const { dimensions } = shape;
    const shapeY = bottom - dimensions[0] * inch + window.scrollY;

    const rect: ClientRect = {
      width: shape.dimensions[1] * inch,
      height: shape.dimensions[0] * inch,
      left: shapeX,
      top: shapeY,
      right: shapeX + shape.dimensions[1] * inch,
      bottom: shapeY + shape.dimensions[0] * inch,
    };
    shapes.forEach((s) => {
      // if (selectedShapes.length > 1) {
      //   if (selectedShapes.some(({ id }) => id === s.id)) {
      //     return;
      //   }
      // }
      if (s.id !== shape?.id && s.rect) {
        if (
          Math.abs(s.rect!.top - rect.top) < SENSITIVITY ||
          Math.abs(s.rect!.top - rect.bottom) < SENSITIVITY
        ) {
          newHighlightedLines.push({ line: Direction.TOP, shape: s });
        }
        if (
          Math.abs(s.rect!.bottom - rect.top) < SENSITIVITY ||
          Math.abs(s.rect!.bottom - rect.bottom) < SENSITIVITY
        ) {
          newHighlightedLines.push({ line: Direction.BOTTOM, shape: s });
        }
        if (
          Math.abs(s.rect!.left - rect.left) < SENSITIVITY ||
          Math.abs(s.rect!.left - rect.right) < SENSITIVITY
        ) {
          newHighlightedLines.push({ line: Direction.LEFT, shape: s });
        }
        if (
          Math.abs(s.rect!.right - rect.left) < SENSITIVITY ||
          Math.abs(s.rect!.right - rect.right) < SENSITIVITY
        ) {
          newHighlightedLines.push({ line: Direction.RIGHT, shape: s });
        }
      }
    });
    setHighlightedLines(newHighlightedLines);
  };

  const handleShapeDragStart = (e: DragStartEvent) => {
    deltaRef.current = { x: 0, y: 0 };
    setIsDragging(true);
    activeIdRef.current = e.active.id.toString();

    if (!shapes.some(({ id }) => id === activeIdRef.current)) {
      setSelectedShapes([]);
    } else if (selectedShapes.length < 2) {
      handleShapeSelect(activeIdRef.current);
    }
    isDelayedRef.current = false;
    isMultiSelectDisabledRef.current = true;
    setTimeout(() => {
      isDelayedRef.current = true;
    }, 0);
  };

  const handleShapeDragMove = (e: DragMoveEvent) => {
    if (selectedShapes.length > 1) {
      const { delta, over } = e;
      const updatedDelta = {
        x: delta.x - deltaRef.current.x,
        y: delta.y - deltaRef.current.y,
      };
      deltaRef.current = delta;
      if (over) {
        let movements: { index: number; coordinates: Coordinates }[] = [];

        for (let i = 0; i < selectedShapes.length; i++) {
          const newCords = getShapeNextCords(
            shapes[selectedShapes[i].index],
            updatedDelta,
            over.rect
          );

          if (!newCords) {
            movements = [];
            break;
          }

          movements.push({
            index: selectedShapes[i].index,
            coordinates: newCords,
          });
        }

        movements.forEach(({ index, coordinates }) => {
          shapes[index].coordinates = coordinates;
        });
      }
    } else {
      setTimeout(() => handleShapeLineHighlights(e.active), 0);
    }
  };

  const handleShapeDragEnd = (e: DragEndEvent) => {
    setIsDragging(false);
    setTimeout(() => setHighlightedLines([]), 0);
    const i = shapes.findIndex(({ id }) => id === e.active.id);
    activeIdRef.current = null;
    const { over, delta } = e;

    if (selectedShapes.length < 2) {
      if (i !== -1) {
        handleEnableMultiSelect();
        if (!isDelayedRef.current) {
          return;
        }

        if (!over) {
          handleShapeDeleteByIndex(i);
          handleShapesUpdate();
          return;
        }

        const coordinates = getShapeNextCords(shapes[i], delta, over.rect);

        if (coordinates) {
          shapes[i].coordinates = coordinates;
        }
        handleShapesUpdate();
      } else if (over) {
        handleEnableMultiSelect();
        handleShapeEnter(e.active, over.rect);
        handleShapesUpdate();
      }
    } else {
      handleEnableMultiSelect();
    }
  };

  const handleDeleteSelectedShapes = () => {
    if (selectedShapes.length !== 0) {
      setShapes(
        shapes.filter((shape) => !selectedShapes.some((s) => s.id === shape.id))
      );
      handleSelectedShapesReset();
    }
  };

  const handleDeletePress = (e: KeyboardEvent) => {
    if (
      e.key === "Delete" ||
      e.key === "Backspace" ||
      e.keyCode === 8 ||
      e.keyCode === 46
    ) {
      handleDeleteSelectedShapes();
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
      setSelectedShapes(shapes.map(({ id }, index) => ({ id, index })));
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
  }, [shapes]);

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
  }, [selectedShapes]);

  return {
    isDragging,
    shapes,
    highlightedLines,
    selectedShapes,
    handleSelectedShapesReset,
    handleShapeSelect,
    handleShapeDragMove,
    handleShapeResize,
    handleShapeSwapDimensionsByIndex,
    handleShapeRotateNinteyByIndex,
    handleShapeDeleteByIndex,
    handleShapesUpdate,
    getIsCrossingBoundaries,
    getShapeNextCords,
    handleShapeMultiSelect,
    handleShapeEnter,
    handleShapeDragStart,
    handleShapeDragEnd,
  };
};

export default useShapes;

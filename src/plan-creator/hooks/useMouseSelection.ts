import { MouseEvent, useState } from "react";

import ISelectionArea from "../types/selection-area.interface";

const useMouseSelection = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [coordinates, setCoordinates] = useState<ISelectionArea>({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  });

  const handleSelectionMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    setIsSelecting(true);
    setCoordinates({
      startX: e.clientX,
      startY: e.clientY + window.scrollY,
      endX: e.clientX,
      endY: e.clientY + window.scrollY,
    });
  };

  const handleSelectionMouseMove = (e: MouseEvent) => {
    if (!isSelecting) {
      return;
    }

    setCoordinates((prev) => ({
      ...prev,
      endX: e.clientX,
      endY: e.clientY + window.scrollY,
    }));
  };

  const handleSelectionMouseUp = (
    callback: (coordinates: ISelectionArea) => void
  ) => {
    setIsSelecting(false);
    callback(coordinates);
  };

  return {
    coordinates,
    isSelecting,
    handleSelectionMouseDown,
    handleSelectionMouseMove,
    handleSelectionMouseUp,
  };
};

export default useMouseSelection;

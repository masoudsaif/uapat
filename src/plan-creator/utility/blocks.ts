import IBlock from "../types/block.interface";
import IElementCoordinates from "../types/element-coordinates.interface";
import ISelectionArea from "../types/selection-area.interface";

export const swapBlockDimensions = (block: IBlock) => {
  const { width, length } = block.dimensions;
  block.dimensions = { width: length, length: width };
};

export const isBlocksOverlapping = (
  rect: IElementCoordinates,
  rect2: IElementCoordinates
) => {
  const { left, right, top, bottom } = rect;
  const { left: left2, right: right2, top: top2, bottom: bottom2 } = rect2;

  return !(right2 < left || left2 > right || bottom2 < top || top2 > bottom);
};

export const isBlockInSelectionArea = (area: ISelectionArea, block: IBlock) => {
  const { startX, startY, endX, endY } = area;
  const { scrollX, scrollY } = window;
  const { left, right, bottom, top } = block.rect!;

  const shapeLeft = Math.min(startX, endX) + scrollX;
  const shapeRight = Math.max(startX, endX) + scrollX;
  const shapeTop = Math.min(startY, endY) + scrollY;
  const shapeBottom = Math.max(startY, endY) + scrollY;

  return isBlocksOverlapping(
    {
      left: left + scrollX,
      right: right + scrollX,
      top: top + scrollY,
      bottom: bottom + scrollY,
    },
    { left: shapeLeft, right: shapeRight, top: shapeTop, bottom: shapeBottom }
  );
};

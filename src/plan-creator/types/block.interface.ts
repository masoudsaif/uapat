import { ClientRect } from "@dnd-kit/core";
import { FC } from "react";

import Block from "../enums/block.enum";
import ICoordinates from "./coordinates.interface";
import IDimensions from "./dimensions.interface";

export default interface IBlock {
  id: string;
  type: Block;
  name: string;
  description?: string;
  displayDimensions: IDimensions;
  dimensions: IDimensions;
  degree?: number;
  isLabelDisabled?: boolean;
  isArrowsDisabled?: boolean;
  isOneDimension?: boolean;
  coordinates?: ICoordinates;
  isBorderless?: boolean;
  label?: string;
  borderWidth?: number;
  backgroundColor?: string;
  backgroundImg?: string;
  rect?: ClientRect;
  component?: FC<any>;
}

import Direction from "../enums/direction.enum";
import IBlock from "./block.interface";

export default interface IHightlightLine {
  line: Direction;
  block: IBlock;
}

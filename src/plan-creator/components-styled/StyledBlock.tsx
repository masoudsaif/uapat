import { Transform } from "@dnd-kit/utilities";
import { Grid, GridProps } from "@mui/material";
import { styled } from "@mui/material/styles";

export interface IStyledBlockProps extends GridProps {
  isDragging?: boolean;
  borderWidth?: number;
  transform?: Transform;
  isSelected?: boolean;
  isBackground?: boolean;
}

const StyledBlock = styled(Grid)<IStyledBlockProps>(
  ({
    borderWidth = 1,
    theme,
    isDragging,
    transform,
    isSelected,
    isBackground,
  }) => ({
    cursor: isDragging ? "grab" : "grabbing",
    border: `${borderWidth}px solid ${
      isSelected || isDragging
        ? theme.palette.secondary.main
        : theme.palette.common.black
    }`,
    ...(isBackground &&
      !isSelected &&
      !isDragging && {
        borderColor: "transparent",
      }),
    ...(transform && {
      transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    }),
    ...(isDragging && {
      boxShadow:
        "rgb(63 63 68 / 5%) 0px 2px 0px 2px, rgb(34 33 81 / 15%) 0px 2px 3px 2px",
    }),
    transition: theme.transitions.create(
      ["margin", "border-width", "border-color", "box-shadow"],
      {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest,
      }
    ),
  })
);

export default StyledBlock;

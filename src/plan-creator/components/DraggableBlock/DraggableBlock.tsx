import Block from "@/plan-creator/enums/block.enum";
import IBlock from "@/plan-creator/types/block.interface";
import { planSettingsState } from "@/redux/store";
import { useDraggable } from "@dnd-kit/core";
import AspectRatioIcon from "@mui/icons-material/AspectRatio";
import RotateRight from "@mui/icons-material/RotateRight";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { Fade, Grid, IconButton, Typography } from "@mui/material";
import { createElement, FC, Fragment, memo, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import StyledBlock, {
  IStyledBlockProps,
} from "../../components-styled/StyledBlock";
import Direction from "../../enums/direction.enum";
import DimensionArrow from "../DimensionArrow/DimensionArrow";

export interface IDraggableBlockProps extends IStyledBlockProps {
  block: IBlock;
  index?: number;
  isDragDisabled?: boolean;
  isOneSelected?: boolean;
  isDropped?: boolean;
  onSwapDimensionsClick?: () => void;
  onRotateNinetyClick?: () => void;
  onResizeClick?: () => void;
}

const DraggableBlock: FC<IDraggableBlockProps> = memo((props) => {
  const {
    isOneSelected,
    isSelected,
    isDropped,
    isDragDisabled,
    block,
    style,
    index,
    children,
    onSwapDimensionsClick,
    onRotateNinetyClick,
    onResizeClick,
  } = props;
  const {
    label,
    degree,
    id,
    type,
    backgroundImg,
    coordinates,
    dimensions,
    component,
    backgroundColor,
    isArrowsDisabled,
    isBorderless,
    isLabelDisabled,
    isOneDimension,
  } = block;
  const { pixelRatio } = useSelector(planSettingsState);
  const { attributes, listeners, setNodeRef, isDragging, transform } =
    useDraggable({
      id,
      data: block,
    });
  const isBackground = useMemo(
    () =>
      (backgroundImg !== undefined && type !== Block.BORDER_IMAGE) ||
      isBorderless,
    [backgroundImg, type, isBorderless]
  );
  const updatedDimensions = useMemo(() => {
    const isVertical = degree === 90 || degree === 270 ? 1 : 0;

    if (isVertical) {
      return {
        width: dimensions.length,
        length: dimensions.width,
      };
    }

    return dimensions;
  }, [degree, dimensions]);
  const isOnlySelected = useMemo(
    () => isOneSelected && isSelected && isDropped,
    [isOneSelected, isSelected, isDropped]
  );
  const [horizArrowDir, setHorizArrowDir] = useState<Direction>(
    Direction.BOTTOM
  );
  const [vertArrowDir, setVertArrowDir] = useState<Direction>(Direction.RIGHT);
  const [isVertArrVisible, setIsVertArrVisible] = useState(false);
  const [isHorizArrVisible, setIsHorizArrVisible] = useState(true);

  const handleToggleVertical = () =>
    setVertArrowDir((prev) =>
      prev === Direction.RIGHT ? Direction.LEFT : Direction.RIGHT
    );

  const handleToggleHorizontal = () =>
    setHorizArrowDir((prev) =>
      prev === Direction.TOP ? Direction.BOTTOM : Direction.TOP
    );

  const handleToggleVertVisibility = () => setIsVertArrVisible((prev) => !prev);

  const handleToggleHorizVisibility = () =>
    setIsHorizArrVisible((prev) => !prev);

  return (
    <StyledBlock
      ref={setNodeRef}
      isDragging={isDragging}
      transform={isDragDisabled ? undefined : transform || undefined}
      isBackground={isBackground}
      style={{
        ...style,
        ...(coordinates && {
          position: "absolute",
          top: coordinates.y,
          left: coordinates.x,
        }),
        width: dimensions.length * pixelRatio,
        height: dimensions.width * pixelRatio,
        ...(type === Block.BORDERLESS &&
          !isOnlySelected && {
            borderColor: "transparent",
          }),
        ...(backgroundColor && {
          backgroundColor: backgroundColor,
        }),
      }}
      {...listeners}
      {...attributes}
      {...props}
    >
      <Fade in={isOnlySelected}>
        <Grid
          container
          sx={{
            position: "absolute",
            top: -32,
            left: -10,
            zIndex: 1,
            width: 100,
          }}
        >
          {onSwapDimensionsClick &&
          dimensions.width !== dimensions.length &&
          !isOneDimension ? (
            <IconButton
              onClick={onSwapDimensionsClick}
              sx={{ width: 25, height: 25 }}
            >
              <SwapHorizIcon fontSize="small" />
            </IconButton>
          ) : null}
          {onRotateNinetyClick ? (
            <IconButton
              onClick={onRotateNinetyClick}
              sx={{ width: 25, height: 25 }}
            >
              <RotateRight fontSize="small" />
            </IconButton>
          ) : null}
          {onResizeClick ? (
            <IconButton onClick={onResizeClick} sx={{ width: 25, height: 25 }}>
              <AspectRatioIcon fontSize="small" />
            </IconButton>
          ) : null}
        </Grid>
      </Fade>
      {index !== undefined && !isLabelDisabled ? (
        <Typography
          sx={{
            position: "absolute",
            textAlign: "center",
            width: "100%",
            fontSize: "12px",
            fontWeight: "bold",
            ...(horizArrowDir === Direction.BOTTOM
              ? { bottom: -17 }
              : { top: -17 }),
          }}
        >
          ITEM #{index + 1}
        </Typography>
      ) : null}
      {isDropped && !isArrowsDisabled ? (
        <Fragment>
          <Fade unmountOnExit in={horizArrowDir === Direction.BOTTOM}>
            <Grid
              container
              sx={{ position: "absolute", bottom: -40, height: 20 }}
            >
              <DimensionArrow
                isVisible={isHorizArrVisible}
                isSelected={isOneSelected && isSelected}
                length={dimensions.length}
                onSwapClick={handleToggleHorizontal}
                onVisibilityClick={handleToggleHorizVisibility}
              />
            </Grid>
          </Fade>
          <Fade unmountOnExit in={horizArrowDir === Direction.TOP}>
            <Grid container sx={{ position: "absolute", top: -40, height: 20 }}>
              <DimensionArrow
                isInverted
                isVisible={isHorizArrVisible}
                isSelected={isOneSelected && isSelected}
                length={dimensions.length}
                onSwapClick={handleToggleHorizontal}
                onVisibilityClick={handleToggleHorizVisibility}
              />
            </Grid>
          </Fade>
          <Fade unmountOnExit in={vertArrowDir === Direction.RIGHT}>
            <Grid item sx={{ position: "absolute", right: -20, height: 20 }}>
              <DimensionArrow
                isVertical
                isVisible={isVertArrVisible}
                isSelected={isOneSelected && isSelected}
                length={dimensions.width}
                onSwapClick={handleToggleVertical}
                onVisibilityClick={handleToggleVertVisibility}
              />
            </Grid>
          </Fade>
          <Fade unmountOnExit in={vertArrowDir === Direction.LEFT}>
            <Grid item sx={{ position: "absolute", left: -25, height: 20 }}>
              <DimensionArrow
                isVertical
                isInverted
                isVisible={isVertArrVisible}
                isSelected={isOneSelected && isSelected}
                length={dimensions.width}
                onSwapClick={handleToggleVertical}
                onVisibilityClick={handleToggleVertVisibility}
              />
            </Grid>
          </Fade>
        </Fragment>
      ) : null}
      <Grid
        container
        sx={{
          position: "relative",
          rotate: `${degree}deg`,
          height: updatedDimensions.width * pixelRatio,
        }}
      >
        <Grid
          container
          sx={{
            position: "absolute",
            ...(degree === 270 && {
              right: 0,
            }),
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
            width: updatedDimensions.length * pixelRatio,
            height: updatedDimensions.width * pixelRatio,
          }}
        >
          {backgroundImg ? (
            <img
              alt={type}
              src={backgroundImg}
              style={{
                position: "absolute",
                objectFit: "fill",
                width: "100%",
                height: "100%",
                userSelect: "none",
              }}
            />
          ) : null}
          {label ? (
            <Typography sx={{ p: 1, userSelect: "none" }}>{label}</Typography>
          ) : null}
          {component ? createElement(component, { block }) : null}
          {children}
        </Grid>
      </Grid>
    </StyledBlock>
  );
});

export default DraggableBlock;

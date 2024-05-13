import { PLAN_ID } from "@/plan-creator/constants/ids";
import gray from "@/plan-creator/styles/gray";
import margin from "@/plan-creator/styles/margin";
import { planSettingsState } from "@/redux/store";
import { useDroppable } from "@dnd-kit/core";
import { Grid } from "@mui/material";
import { FC, HTMLAttributes, memo, useMemo } from "react";
import { useSelector } from "react-redux";

export interface IPlanContainerProps extends HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
}

const PlanContainer: FC<IPlanContainerProps> = memo(
  ({ children, ...props }) => {
    const { planDimensions, pixelRatio } = useSelector(planSettingsState);
    const { setNodeRef } = useDroppable({
      id: PLAN_ID,
    });
    const dimensions = useMemo(
      () => ({
        width: planDimensions.width * pixelRatio,
        length: planDimensions.length * pixelRatio,
      }),
      [planDimensions, pixelRatio]
    );

    return (
      <Grid
        {...props}
        container
        id={PLAN_ID}
        ref={setNodeRef}
        sx={{
          ml: margin(8),
          border: `${1}px solid ${gray[500]}`,
          width: dimensions.length,
          height: dimensions.width,
          overflow: "hidden",
        }}
      >
        {children}
      </Grid>
    );
  }
);

export default PlanContainer;

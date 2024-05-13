import { PLAN_ID } from "@/plan-creator/constants/ids";
import gray from "@/plan-creator/styles/gray";
import margin from "@/plan-creator/styles/margin";
import { editorSettingsState } from "@/redux/store";
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
    const { planDimensions, pixelRatio } = useSelector(editorSettingsState);
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
      <div
        {...props}
        id={PLAN_ID}
        ref={setNodeRef}
        style={{
          border: `${1}px solid ${gray[500]}`,
          width: dimensions.length,
          height: dimensions.width,
          overflow: "hidden",
        }}
      >
        {children}
      </div>
    );
  }
);

export default PlanContainer;

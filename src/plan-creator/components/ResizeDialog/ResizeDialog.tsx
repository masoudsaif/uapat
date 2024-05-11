import PlanCreatorDialog, {
  IPlanCreatorDialogProps,
} from "@/plan-creator/components-ui/PlanCreatorDialog/PlanCreatorDialog";
import UnitTextField from "@/plan-creator/components-ui/UnitTextField/UnitTextField";
import IBlock from "@/plan-creator/types/block.interface";
import IIndex from "@/plan-creator/types/index.interface";
import { isPositiveNonZeroNumber } from "@/plan-creator/utility/numbers";
import { Grid } from "@mui/material";
import { ChangeEvent, FC, memo, useEffect, useMemo, useState } from "react";

export interface IResizeDialogProps extends IPlanCreatorDialogProps {
  block?: IBlock & IIndex;
  onBlockResize: (i: number, w: number, l: number) => void;
}

const ResizeDialog: FC<IResizeDialogProps> = memo(
  ({ block, onBlockResize, onCloseClick, ...props }) => {
    const [values, setValues] = useState({
      width: (block?.dimensions.width || "").toString(),
      length: (block?.dimensions.length || "").toString(),
    });
    const [isValuesValid, setIsValuesValid] = useState({
      width: true,
      length: true,
    });
    const isRotated = useMemo(
      () => block?.degree === 90 || block?.degree === 270,
      [block?.degree]
    );

    const handleChange = ({
      target: { name, value },
    }: ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      setIsValuesValid((prev) => ({
        ...prev,
        [name]: isPositiveNonZeroNumber(value),
      }));
    };

    const handleResizeClick = () => {
      const { width, length } = values;
      const { isOneDimension } = block!;

      const w = isRotated && isOneDimension ? length : width;
      const l = isRotated && isOneDimension ? width : length;
      console.log(w, l);
      onBlockResize(block?.index!, Number(w), Number(l));
      onCloseClick();
    };

    useEffect(() => {
      if (block && block.isOneDimension) {
        setValues({
          width: (
            block?.dimensions[isRotated ? "length" : "width"] || ""
          ).toString(),
          length: (
            block?.dimensions[isRotated ? "width" : "length"] || ""
          ).toString(),
        });
      } else if (block) {
        setValues({
          width: (block?.dimensions.width || "").toString(),
          length: (block?.dimensions.length || "").toString(),
        });
      }
    }, [block, isRotated]);

    return (
      <PlanCreatorDialog
        title="Resize"
        onActionClick={handleResizeClick}
        onCloseClick={onCloseClick}
        {...props}
      >
        <Grid container direction="column" gap={2}>
          {block?.isOneDimension ? null : (
            <UnitTextField
              label="Width"
              variant="standard"
              name="width"
              value={values.width}
              isValid={isValuesValid.width}
              onChange={handleChange}
            />
          )}
          <UnitTextField
            label="Length"
            variant="standard"
            name="length"
            value={values.length}
            isValid={isValuesValid.length}
            onChange={handleChange}
          />
        </Grid>
      </PlanCreatorDialog>
    );
  }
);

export default ResizeDialog;

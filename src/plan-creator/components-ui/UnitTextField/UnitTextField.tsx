import Unit from "@/plan-creator/enums/unit.enum";
import { StandardTextFieldProps, TextField, Typography } from "@mui/material";
import { FC, useMemo } from "react";

export interface IUnitTextFieldProps extends StandardTextFieldProps {
  isValid?: boolean;
  unit?: Unit;
}

const UnitTextField: FC<IUnitTextFieldProps> = ({
  isValid,
  type = "number",
  variant = "standard",
  InputLabelProps,
  value,
  inputProps,
  unit,
  ...props
}) => {
  const color = useMemo(() => {
    if (typeof isValid === "boolean") {
      return isValid ? "success" : "error";
    }

    return undefined;
  }, [isValid]);

  return (
    <TextField
      type={type}
      variant={variant}
      value={value}
      color={color}
      InputLabelProps={{
        shrink: true,
        ...InputLabelProps,
      }}
      InputProps={
        unit
          ? {
              endAdornment: (
                <Typography
                  color="primary"
                  fontWeight="bold"
                  pl={1}
                  fontSize={14}
                >
                  {unit}
                </Typography>
              ),
            }
          : undefined
      }
      inputProps={{
        min: 0,
        ...inputProps,
      }}
      {...props}
    />
  );
};

export default UnitTextField;

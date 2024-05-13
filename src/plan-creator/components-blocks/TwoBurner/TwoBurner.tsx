import { Grid, GridProps } from "@mui/material";
import { FC, useMemo } from "react";
import { useSelector } from "react-redux";

import { editorSettingsState } from "../../../redux/store";
import IBlock from "../../types/block.interface";
import Burner from "../Burner/Burner";

export interface ITwoBurnerProps extends GridProps {
  block: IBlock;
}

const TwoBurner: FC<ITwoBurnerProps> = ({
  block: {
    dimensions: { width, length },
  },
  ...props
}) => {
  const { pixelRatio } = useSelector(editorSettingsState);
  const burnerLength = useMemo(() => {
    const shorterSide = width > length ? length : width;

    return shorterSide * pixelRatio - 10 - 4;
  }, [width, length, pixelRatio]);

  return (
    <Grid container direction="column" {...props}>
      <Grid container justifyContent="space-evenly">
        <Burner length={burnerLength} />
        <Burner length={burnerLength} />
      </Grid>
    </Grid>
  );
};

export default TwoBurner;

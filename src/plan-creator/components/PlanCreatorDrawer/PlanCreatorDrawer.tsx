import StyledDrawerHeader from "@/plan-creator/components-styled/StyledDrawerHeader";
import { DRAWER_WIDTH } from "@/plan-creator/constants/options";
import { turnOff } from "@/redux/slices/settingsSlice";
import { settingsState } from "@/redux/store";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Divider, Grid, IconButton, Slide } from "@mui/material";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

const PlanCreatorDrawer = memo(() => {
  const dispatch = useDispatch();
  const { isDrawerOpen } = useSelector(settingsState);

  const handleDrawerClose = () => dispatch(turnOff("isDrawerOpen"));

  return (
    <Slide in={isDrawerOpen} direction="left" mountOnEnter unmountOnExit>
      <Grid
        container
        sx={{
          position: "absolute",
          right: 0,
          top: 0,
          width: DRAWER_WIDTH,
          height: "100vh",
        }}
      >
        <Divider
          orientation="vertical"
          sx={{ position: "fixed", top: 0, height: "1500%" }}
        />
        <Grid
          container
          direction="column"
          sx={{ top: 0, position: "absolute" }}
        ></Grid>
      </Grid>
    </Slide>
  );
});

export default PlanCreatorDrawer;

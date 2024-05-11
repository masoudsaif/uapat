import StyledAppBar from "@/plan-creator/components-styled/StyledAppBar";
import { turnOff, turnOn } from "@/redux/slices/settingsSlice";
import { settingsState } from "@/redux/store";
import InterestsIcon from "@mui/icons-material/Interests";
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const PlanCreatorBar = () => {
  const dispatch = useDispatch();
  const { isBlockDrawerOpen } = useSelector(settingsState);
  const [anchorElFile, setAnchorElFile] = useState<null | HTMLElement>(null);

  const handleDrawerOpen = () =>
    dispatch((isBlockDrawerOpen ? turnOff : turnOn)("isBlockDrawerOpen"));

  const handleOpenFileMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElFile(event.currentTarget);
  };

  const handleCloseFileMenu = () => {
    setAnchorElFile(null);
  };

  return (
    <StyledAppBar position="fixed" open={isBlockDrawerOpen}>
      <Toolbar variant="dense">
        <Box display="flex" flex={1}>
          <Button color="inherit" onClick={handleOpenFileMenu}>
            File
          </Button>
        </Box>
        <Menu
          sx={{ mt: "32px" }}
          id="menu-appbar"
          anchorEl={anchorElFile}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={Boolean(anchorElFile)}
          onClose={handleCloseFileMenu}
        >
          <MenuItem>
            <Typography textAlign="center">New</Typography>
          </MenuItem>
          <MenuItem>
            <Typography textAlign="center">Save</Typography>
          </MenuItem>
          <MenuItem>
            <Typography textAlign="center">Save As</Typography>
          </MenuItem>
        </Menu>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
        >
          <InterestsIcon />
        </IconButton>
      </Toolbar>
    </StyledAppBar>
  );
};

export default PlanCreatorBar;

"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import store from "@/redux/store";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";

import Main from "./components-light/Main/Main";
import BlockDrawer from "./components/BlockDrawer/BlockDrawer";
import PlanCreator from "./components/PlanCreator/PlanCreator";
import PlanCreatorBar from "./components/PlanCreatorBar/PlanCreatorBar";
import theme from "./styles/theme";

const PlanCreatorApp = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Main>
          <PlanCreatorBar />
          <BlockDrawer />
          <PlanCreator />
        </Main>
      </ThemeProvider>
    </Provider>
  );
};

export default PlanCreatorApp;

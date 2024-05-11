"use client";
import store from "@/redux/store";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { Provider } from "react-redux";
import theme from "./styles/theme";
import PlanCreatorBar from "./components/PlanCreatorBar/PlanCreatorBar";
import BlockDrawer from "./components/BlockDrawer/BlockDrawer";

const PlanCreator = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <main>
          <PlanCreatorBar />
          <BlockDrawer />
        </main>
      </ThemeProvider>
    </Provider>
  );
};

export default PlanCreator;

import { createRoot } from "react-dom/client";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App.jsx";
import store from "./services/store/store";
import appTheme from "./theme/appTheme";

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={appTheme}>
    <CssBaseline />
    <Provider store={store}>
      <App />
    </Provider>
  </ThemeProvider>,
);

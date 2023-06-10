import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Box } from "@mui/material";
import Router from "./Routes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Box
      margin="10px 50px 10px 50px"
      display="flex"
      justifyContent="center"
      flexDirection="column"
    >
      <Router />
    </Box>
  </React.StrictMode>
);

import React from "react";
import {createRoot} from "react-dom/client";
import {BrowserRouter} from "react-router-dom";
import App from "./App";
import MaintenancePage from "./pages/MaintenancePage.jsx";
import "./fonts.css";
import "./styles.css";
const RootApp=App;
createRoot(document.getElementById("root")).render(<BrowserRouter><RootApp/></BrowserRouter>);

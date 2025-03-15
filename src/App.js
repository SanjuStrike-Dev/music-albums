import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import LandingPage from "./components/pages/LandingPage";
import AlbumDetails from "./components/pages/AlbumDetails";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/collection/:id" element={<AlbumDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

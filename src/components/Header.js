import React from "react";
import { AppBar, Toolbar, Typography, Breadcrumbs } from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = ({ title }) => {
  const location = useLocation();
  const isAlbumPage = location.pathname.includes("/collection/");

  return (
    <>
      {!isAlbumPage ? (
        <AppBar position="static" className="header-bar">
          <Toolbar className="header-toolbar">
            <text className="header-title">Overview</text>
          </Toolbar>
        </AppBar>
      ) : (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          className="breadcrumb"
          style={{ padding: "8px 16px" }}
        >
          <Link to="/" className="breadcrumb-link">Overview</Link>
          <Typography color="textPrimary">{title}</Typography>
        </Breadcrumbs>
      )}
    </>
  );
};

export default Header;

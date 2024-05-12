import Grid from "@mui/material/Grid";
import { Typography, Button, Box } from "@mui/material";

import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { isAuthed } from "./auth/authManager";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import PontingRoboImage from "../src/images/pngegg_pointing.png";

import ParticlesBg from "particles-bg";


function App() {
  useEffect(() => {
    if (isAuthed()) {
      window.location.href = "/home";
    }
  }, []);

  return (
    <Box
      sx={{
        backgroundImage: `url(${PontingRoboImage})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "left",
        minHeight: "100vh",
      }}
    >
      <Grid container spacing={1}>
      <ParticlesBg type="cobweb" bg={true} color="#32b5ed" />

        <Grid item xs={12}>
          <Typography
            variant="h4"
            style={{ textAlign: "center", marginTop: "125px" }}
          >
            Welcome to WebCrafter
          </Typography>
          <Typography variant="h4" style={{ textAlign: "center" }}>
            The Low code web automation platform
          </Typography>
        </Grid>
      </Grid>
      <Grid container style={{ marginTop: "20px" }} spacing={1}>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Link to="/login">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "3px" }}
            >
              Login
            </Button>
          </Link>

          <Link to="/register">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "3px" }}
            >
              Register
            </Button>
          </Link>
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;

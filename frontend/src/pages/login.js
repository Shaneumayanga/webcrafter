import { Typography, Button, Box, Grid, TextField } from "@mui/material";
import { apiLogin } from "../api/api";
import React, { useState, useEffect } from "react";
import { isAuthed } from "../auth/authManager";

import ParticlesBg from "particles-bg";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [loginToContinue, setLoginToContinue] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthed()) {
      window.location.href = "/home";
    }
    const params = new URLSearchParams(window.location.search);
    const tocontinueValue = params.get("tocontinue");
    if (tocontinueValue && JSON.parse(tocontinueValue) === true) {
      setLoginToContinue(true);
    }
  }, []);

  const validateInputs = () => {
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return false;
    }
    setError("");
    return true;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setisLoading(true);
    const loginResult = await apiLogin(email, password);
    if (loginResult) {
      window.localStorage.setItem("token", loginResult.token);
      window.location.href = "/home";
    } else {
      setisLoading(false);
    }
  };

  return (
    <Box>
      <Grid container spacing={1}>
        <ParticlesBg type="cobweb" bg={true} color="#bdf0ec" />
        <Grid item xs={12}>
          <Typography
            variant="h4"
            style={{ textAlign: "center", marginTop: "150px" }}
          >
            Login to WebCrafter
          </Typography>
          <Typography
            variant="h6"
            visibility={loginToContinue ? "visible" : "hidden"}
            style={{ textAlign: "center", color: "#999999", marginTop: "2px" }}
          >
            {loginToContinue ? "Please login to continue." : ""}
          </Typography>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
          <TextField
            label="Email"
            variant="standard"
            sx={{ width: "50%" }}
            onChange={(e) => setEmail(e.target.value)}
            error={error && !email}
            helperText={error && !email ? error : ""}
          ></TextField>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <TextField
            label="Password"
            variant="standard"
            sx={{ width: "50%" }}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            error={error && !password}
            helperText={error && !password ? error : ""}
          ></TextField>
        </Grid>
        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "3px" }}
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default LoginPage;

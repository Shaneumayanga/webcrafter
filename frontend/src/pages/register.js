import { Typography, Button, Box, Grid, TextField } from "@mui/material";
import { apiRegister } from "../api/api";

import React, { useState, useEffect } from "react";
import { isAuthed } from "../auth/authManager";

import ParticlesBg from "particles-bg";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isAuthed()) {
      window.location.href = "/home";
    }
  }, []);

  const validateInputs = () => {
    if (!email || !password || !username) {
      setError("Please fill in all fields.");
      return false;
    }
    setError("");
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }

    setisLoading(true);
    const loginResult = await apiRegister(email, password, username);
    if (loginResult) {
      window.location.href = `/login?tocontinue=${true}`;
    } else {
      setError("Registration failed. Please try again.");
      setisLoading(false);
    }
  };

  return (
    <Box>
      <ParticlesBg type="cobweb" bg={true} color="#bdf0ec" />
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            style={{ textAlign: "center", marginTop: "150px" }}
          >
            Register to WebCrafter
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
          <TextField
            label="Username"
            variant="standard"
            sx={{ width: "50%" }}
            onChange={(e) => setUsername(e.target.value)}
            error={error && !username}
            helperText={error && !username ? error : ""}
          ></TextField>
        </Grid>

        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ margin: "3px" }}
            onClick={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? "Creating your account" : "Register"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RegisterPage;

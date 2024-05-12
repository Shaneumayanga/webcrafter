import React, { useState, useEffect } from "react";
import { isAuthed } from "../auth/authManager";
import {
  Typography,
  Button,
  Box,
  Grid,
  TextField,
  Card,
  CardContent,
  IconButton,
  Modal,
} from "@mui/material";

import { Link } from "react-router-dom";

import {
  getUserAutomations,
  apiRunAutomation,
  apiGetLogsPerAutomation,
  apiToggleAutomationkeepRunning,
} from "../api/api";

import Refresh from "@mui/icons-material/Refresh";
import ViewIcon from "@mui/icons-material/RemoveRedEye";
import ParticlesBg from "particles-bg";

import PlayIcon from "@mui/icons-material/PlayCircle";
import PauseIcon from "@mui/icons-material/PauseCircle";
import RobotPeekingImage from "../images/robot_peeking.png";

function Home() {
  const [automations, setAutomations] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showModel, setShowModel] = useState(false);

  const fetchData = async () => {
    if (!isAuthed()) {
      window.location.href = "/";
    } else {
      const automations = await getUserAutomations();
      setAutomations(automations);
    }
  };

  const viewLogsClick = async (automation) => {
    const logs = await apiGetLogsPerAutomation(automation._id);
    setLogs(logs);
    setShowModel(true);
  };

  const toggleAutomationKeepRunning = async (automation) => {
    await apiToggleAutomationkeepRunning(automation._id);
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const runAutomation = async (index, automation) => {
    await apiRunAutomation(automation._id);
    fetchData();
  };

  const convertISODateToNormalDate = (isoDate) => {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <Box
  
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            variant="h4"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            Create your automations
          </Typography>
        </Grid>

        <Grid item xs={12} style={{ textAlign: "center" }}>
          <Link to="/build-automation">
            <Button
              variant="contained"
              color="primary"
              style={{ margin: "3px" }}
            >
              create an automation
            </Button>
          </Link>
        </Grid>
      </Grid>
      <ParticlesBg type="cobweb" bg={true} color="#bdf0ec" />
      <Typography
        variant="h6"
        style={{ textAlign: "center", marginTop: "50px", color: "#5c5959" }}
      >
        These are your automations
      </Typography>

      {automations.map((automation, index) => {
        return (
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            <Card
              key={index}
              sx={{ border: "1px solid #000000", width: "50%" }}
            >
              <CardContent>
                <Typography variant="h6" style={{ textAlign: "center" }}>
                  {automation.name}
                </Typography>
                <Typography
                  variant="h6"
                  style={{
                    textAlign: "center",
                    color: automation.is_running ? "yellowgreen" : "red",
                  }}
                >
                  status: {automation.is_running ? "running" : "not running"}
                </Typography>
                <Button
                  onClick={() => runAutomation(index, automation)}
                  disabled={automation.is_running || automation.keep_running}
                >
                  Run
                </Button>
                <IconButton
                  onClick={() => {
                    fetchData();
                  }}
                >
                  <Refresh />
                </IconButton>
                <IconButton
                  onClick={() => {
                    viewLogsClick(automation);
                  }}
                >
                  <ViewIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    toggleAutomationKeepRunning(automation);
                  }}
                >
                  {automation.keep_running ? <PauseIcon /> : <PlayIcon />}
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
      <Modal
        open={showModel}
        onClose={() => {
          setShowModel(false);
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            pt: 2,
            px: 4,
            pb: 3,
            overflowY: "scroll",
          }}
        >
          <Typography
            variant="h5"
            style={{
              textAlign: "center",
              color: "#5c5959",
              marginBottom: "20px",
            }}
          >
            These are your logs
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: "auto" }}>
            {logs.map((log, index) => (
              <Box
                key={index}
                sx={{
                  marginBottom: "10px",
                  borderRadius: 4,
                  backgroundColor: log.log_type === 1 ? "#FFBABA" : "#DFF2BF",
                  padding: "8px",
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{
                    color: log.log_type === 1 ? "#D8000C" : "#4F8A10",
                  }}
                >
                  {log.log_type === 1 ? "Error" : "Success"}
                </Typography>

                <Typography
                  variant="subtitle1"
                  style={{
                    color: log.log_type === 1 ? "#D8000C" : "#4F8A10",
                  }}
                >
                  {convertISODateToNormalDate(log.created_at)}
                </Typography>

                <Typography variant="body1" style={{ marginTop: "8px" }}>
                  {log.log_text}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
export default Home;

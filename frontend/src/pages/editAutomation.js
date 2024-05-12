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
  FormControl,
  MenuItem,
  Checkbox,
  Divider,
  FormGroup,
  FormControlLabel,
} from "@mui/material";

import Select, { SelectChangeEvent } from "@mui/material/Select";

import { Routes, Route, useParams } from "react-router-dom";

import { apiFetchAutomationData, apiUpdateAutomationSteps } from "../api/api";

function EditAutomation() {
  let { automation_id } = useParams();

  const [automation, setAutomation] = useState([]);
  const [automationSteps, setAutomationSteps] = useState([]);

  const fetchData = async () => {
    const automationData = await apiFetchAutomationData(automation_id);
    setAutomation(automationData);
    const steps = automationData.steps;
    setAutomationSteps(steps);
  };

  const handleUpdateBtnClick = async () => {
      const updateResult = await apiUpdateAutomationSteps(automation_id,automationSteps);
      alert(JSON.stringify(updateResult));
  };

  useEffect(() => {
    if (!isAuthed()) {
      window.location.href = "/";
    } else {
      fetchData();
    }
  }, []);

  return (
    <Box>
      {automationSteps.map((step, index) => {
        return automationSteps[index].step_type !== 1 ? (
          <>
            <Box>
              <Grid
                item
                xs={12}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  textAlign: "center",
                }}
                marginTop={"20px"}
              >
                <Card>
                  <CardContent>
                    <Box>
                      <Typography
                        variant="h6"
                        style={{ textAlign: "center", fontStyle: "oblique" }}
                      >
                        Select a step type
                      </Typography>
                      <FormControl sx={{ margin: "10px" }}>
                        <Select
                          value={automationSteps[index].step_type}
                          label="step type"
                          onChange={(event) => {
                            const newMainStepType = event.target.value;
                            const updateAutomationStepsbody = [
                              ...automationSteps,
                            ];
                            updateAutomationStepsbody[index].step_type =
                              newMainStepType;
                            setAutomationSteps(updateAutomationStepsbody);
                          }}
                        >
                          <MenuItem value={2}>
                            search for html element by id
                          </MenuItem>
                          <MenuItem value={4}>
                            search for html element by custom query
                          </MenuItem>
                          <MenuItem value={5}>press enter btn on page</MenuItem>
                          <MenuItem value={6}>take screenshot of page</MenuItem>
                        </Select>
                      </FormControl>

                      {automationSteps[index].step_type !== 5 &&
                        automationSteps[index].step_type !== 6 && (
                          <>
                            <Typography
                              variant="h6"
                              style={{
                                textAlign: "center",
                                fontStyle: "oblique",
                              }}
                            >
                              Enter a selector
                            </Typography>

                            <TextField
                              label="Enter a selector"
                              variant="standard"
                              sx={{ width: "50%" }}
                              value={automationSteps[index].selector}
                              onChange={(event) => {
                                const newSelectorForstep = event.target.value;
                                const updateAutomationStepsbody = [
                                  ...automationSteps,
                                ];
                                updateAutomationStepsbody[index].selector =
                                  newSelectorForstep;
                                setAutomationSteps(updateAutomationStepsbody);
                              }}
                            />

                            <FormControl sx={{ margin: "10px" }}>
                              <Select
                                value={
                                  automationSteps[index].sub_steps[0].step_type
                                }
                                label="sub step type"
                                onChange={(event) => {
                                  const newSubStepType = event.target.value;
                                  const updateAutomationStepsbody = [
                                    ...automationSteps,
                                  ];
                                  updateAutomationStepsbody[
                                    index
                                  ].sub_steps[0].step_type = newSubStepType;
                                  setAutomationSteps(updateAutomationStepsbody);
                                }}
                              >
                                <MenuItem value={1}>input text</MenuItem>
                                <MenuItem value={2}>click</MenuItem>
                                <MenuItem value={3}>Get text content</MenuItem>
                              </Select>
                            </FormControl>
                          </>
                        )}

                      {automationSteps[index].step_type !== 5 &&
                        automationSteps[index].step_type !== 6 &&
                        automationSteps[index].sub_steps[0].step_type !== 2 &&
                        automationSteps[index].sub_steps[0].step_type !== 3 && (
                          <>
                            <Typography
                              variant="h6"
                              style={{
                                textAlign: "center",
                                fontStyle: "oblique",
                              }}
                            >
                              Text to input
                            </Typography>

                            <Box>
                              <TextField
                                label="Enter a text to input"
                                variant="standard"
                                sx={{ width: "50%" }}
                                value={automationSteps[index].sub_steps[0].data}
                                onChange={(event) => {
                                  const newtextToInput = event.target.value;
                                  const updateAutomationStepsbody = [
                                    ...automationSteps,
                                  ];
                                  updateAutomationStepsbody[
                                    index
                                  ].sub_steps[0].data = newtextToInput;
                                  setAutomationSteps(updateAutomationStepsbody);
                                }}
                              ></TextField>
                            </Box>
                          </>
                        )}

                      {automationSteps[index].step_type !== 5 &&
                        automationSteps[index].step_type !== 6 && (
                          <>
                            <FormGroup sx={{ textAlign: "center" }}>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={
                                      automationSteps[index].sub_steps[0]
                                        .wait_for_new_page
                                    }
                                    onChange={(event) => {
                                      const newSubStepType =
                                        event.target.checked;
                                      const updateAutomationStepsbody = [
                                        ...automationSteps,
                                      ];
                                      updateAutomationStepsbody[
                                        index
                                      ].sub_steps[0].wait_for_new_page =
                                        newSubStepType;
                                      setAutomationSteps(
                                        updateAutomationStepsbody
                                      );
                                    }}
                                  ></Checkbox>
                                }
                                label="Wait for page to load"
                              />
                            </FormGroup>
                          </>
                        )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Box>
          </>
        ) : (
          <div></div>
        );
      })}
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          justifyContent: "center",
          textAlign: "center",
        }}
        marginTop={"20px"}
      >
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "3px" }}
          onClick={() => {
            handleUpdateBtnClick();
          }}
        >
          Update
        </Button>
      </Grid>
    </Box>
  );
}

export default EditAutomation;

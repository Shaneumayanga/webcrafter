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

import AddIcon from "@mui/icons-material/Add";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { apiCreateAutomation } from "../api/api";
import ParticlesBg from "particles-bg";
import uuid from "react-uuid";

import { motion } from "framer-motion"; // Import motion from framer-motion
import RoboWavingImage from "../images/pngegg_saying_hi.png";

function BuildAutomation() {
  //refractor later
  const getStepDescriptionFromId = (id) => {
    let description = "";
    if (id === 1) {
      description = "Go to a specific page";
    } else if (id === 2) {
      description = "Search for HTML element by ID";
    } else if (id === 3) {
      description = "Search for HTML elements by class name";
    } else if (id === 4) {
      description = "Search for HTML element by custom query";
    } else if (id === 5) {
      description = "Click enter button on page";
    } else if (id === 6) {
      description = "take screenshot of page";
    } else {
      description = "Unknown type";
    }
    return description;
  };

  useEffect(() => {
    if (!isAuthed()) {
      window.location.href = "/";
    }
  }, []);

  const [botName, setBotName] = useState(undefined);
  const [hideBotNameInputs, setHideBotNameInputs] = useState(false);
  const [error, setError] = useState("");
  const [url, setURL] = useState("");
  const [isUrlSet, setIsUrlSet] = useState(false);
  const [showPlusBtn, setShowPlusBtn] = useState(false);

  const [automationBody, setAutomatioBody] = useState({});

  const [stepsCards, setStepsCards] = useState([]);

  const [mainStepType, setMainStepType] = useState(undefined);
  const [subStepType, setSubStepType] = useState(undefined);
  const [selector, setSelector] = useState(undefined);

  const [stepText, setStepText] = useState(undefined);

  const [stepsDescription, setStepsDescription] = useState([]);

  const [stepToCardIndexMapping, setStepToCardIndexMapping] = useState([]);

  const [waitForPageToLoad, setWaitForPageToLoad] = useState(false);

  const handleBotNameBtnClick = () => {
    if (!botName) {
      setError("please enter a botname");
      return;
    }

    const updateBody = automationBody;
    updateBody["name"] = botName;
    updateBody["bot_type"] = 1;

    setAutomatioBody(updateBody);
    setHideBotNameInputs(true);
  };

  const handleSelectorTextFieldChange = (e) => {
    setSelector(e);
  };

  const handlesetURLBtnClick = () => {
    if (!url) {
      alert("please enter a url");
      return;
    }

    setIsUrlSet(true);
    setShowPlusBtn(true);

    const updateBody = automationBody;
    updateBody["website_url"] = url;
    updateBody["steps"] = [
      {
        step_type: 1,
      },
    ];

    setAutomatioBody(updateBody);
  };

  const handleMainStepTypeChange = (event) => {
    setMainStepType(event.target.value);
  };

  const handleSubStepTypeChange = (event, uuid) => {
    setSubStepType(event.target.value);
  };

  const saveStepBtnClick = (index) => {
    const step = {};

    step.step_type = mainStepType;
    step.selector = selector;
    step.sub_steps = [
      {
        step_type: subStepType,
        data: stepText,
        wait_for_new_page: waitForPageToLoad,
      },
    ];

    setStepToCardIndexMapping([
      ...stepToCardIndexMapping,
      { cardIndex: index, step },
    ]);

    const updatedDescriptions = [...stepsDescription];
    updatedDescriptions[index] = `Saved step of type ${getStepDescriptionFromId(
      mainStepType
    )}`;
    setStepsDescription(updatedDescriptions);

    const updatedCards = [...stepsCards];
    updatedCards[index].isSaved = true;
    setStepsCards(updatedCards);

    setMainStepType(undefined);
    setSubStepType(undefined);
    setSelector(undefined);
    setStepText(undefined);
    setWaitForPageToLoad(false);
  };

  const handleAddStepBtnClick = () => {
    const stepUUID = uuid();

    const step = (
      <Box>
        <Typography
          variant="h6"
          style={{ textAlign: "center", fontStyle: "oblique" }}
        >
          Select a step type
        </Typography>
        <FormControl sx={{ margin: "10px" }}>
          <Select
            value={mainStepType}
            label="step type"
            onChange={handleMainStepTypeChange}
          >
            <MenuItem value={2}>search for html element by id</MenuItem>
            <MenuItem value={4}>
              search for html element by custom query
            </MenuItem>
            <MenuItem value={5}>press enter btn on page</MenuItem>
            <MenuItem value={6}>take screenshot of page</MenuItem>
          </Select>
        </FormControl>
      </Box>
    );
    setStepsCards([
      ...stepsCards,
      { stepID: stepUUID, showTextToInput: false, isSaved: false, card: step },
    ]);
  };

  const handleEditButtonClick = (index) => {
    const updatedCards = [...stepsCards];
    updatedCards[index].isSaved = false;
    setStepsCards(updatedCards);
  };

  const handleDoneBtnClick = async () => {
    if (stepToCardIndexMapping.length === 0) {
      alert("please add atleast one step");
      return;
    }

    for (let i = 0; i < stepToCardIndexMapping.length; i++) {
      const step = stepToCardIndexMapping[i].step;
      const updateBody = automationBody;
      updateBody["steps"] = [...automationBody["steps"], step];
      setAutomatioBody(updateBody);
    }

    await apiCreateAutomation(automationBody);

    window.location.href = "/home";
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box>
        <ParticlesBg type="cobweb" bg={true} color="#bdf0ec" />
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography
              variant="h4"
              style={{ textAlign: "center", marginTop: "20px" }}
            >
              Build your automation {botName ? ": ".concat(botName) : ""}
            </Typography>
          </Grid>
        </Grid>
        <Box
          sx={{
            display: hideBotNameInputs ? "block" : "none",
            marginTop: "25px",
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Card variant="outlined" sx={{ maxWidth: 345 }}>
              {isUrlSet ? (
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{ textAlign: "center", fontStyle: "oblique" }}
                  >
                    URL set for : {url}
                  </Typography>
                </CardContent>
              ) : (
                <CardContent>
                  <Typography
                    variant="h6"
                    style={{ textAlign: "center", fontStyle: "oblique" }}
                  >
                    Enter a URL:
                  </Typography>

                  <TextField
                    label="URL:"
                    variant="standard"
                    inputMode="url"
                    sx={{ width: "300px" }}
                    onChange={(e) => setURL(e.target.value)}
                  ></TextField>

                  {/* <Typography
                    variant="h6"
                    style={{ textAlign: "center", fontStyle: "oblique" }}
                  >
                    Keep running settings:
                  </Typography>

                  <Select
                    // value={subStepType}
                    label="sub step type"
                    // onChange={(e) => {
                    //   handleSubStepTypeChange(e);
                    // }}
                  >
                    <MenuItem value={1}>every 1 hour</MenuItem>
                    <MenuItem value={2}>every 4 hours</MenuItem>
                    <MenuItem value={3}>every day</MenuItem>
                    <MenuItem value={4}>every week</MenuItem>
                    <MenuItem value={4}>every month</MenuItem>
                  </Select> */}

                  <Button
                    variant="contained"
                    color="primary"
                    style={{ marginTop: "8px" }}
                    onClick={handlesetURLBtnClick}
                  >
                    done
                  </Button>
                </CardContent>
              )}
            </Card>
          </Grid>
        </Box>
        <Box
          sx={{
            marginTop: "25px",
          }}
        >
          {stepsCards.map((card, index) => {
            return (
              <div key={index}>
                {card.isSaved ? (
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
                          <Typography
                            variant="h6"
                            style={{ textAlign: "center" }}
                          >
                            {stepsDescription[index]}
                          </Typography>

                          {/* <Button
                            onClick={() => {
                              handleEditButtonClick(index);
                            }}
                          >
                            Edit
                          </Button> */}
                        </CardContent>
                      </Card>
                    </Grid>
                  </Box>
                ) : (
                  <Box>
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
                      <Card>
                        <CardContent>
                          {card.card}

                          {mainStepType !== 5 && mainStepType !== 6 && (
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
                                onChange={(e) =>
                                  handleSelectorTextFieldChange(e.target.value)
                                }
                              />

                              <FormControl sx={{ margin: "10px" }}>
                                <Select
                                  value={subStepType}
                                  label="sub step type"
                                  onChange={(e) => {
                                    handleSubStepTypeChange(e);
                                  }}
                                >
                                  <MenuItem value={1}>input text</MenuItem>
                                  <MenuItem value={2}>click</MenuItem>
                                  <MenuItem value={3}>
                                    Get text content
                                  </MenuItem>
                                </Select>
                              </FormControl>
                            </>
                          )}

                          {mainStepType !== 5 &&
                            mainStepType !== 6 &&
                            subStepType !== 2 &&
                            subStepType !== 3 && (
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
                                    onChange={(e) =>
                                      setStepText(e.target.value)
                                    }
                                  ></TextField>
                                </Box>
                              </>
                            )}

                          {mainStepType !== 5 && mainStepType !== 6 && (
                            <>
                              <FormGroup sx={{ textAlign: "center" }}>
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={waitForPageToLoad}
                                      onChange={(e) => {
                                        setWaitForPageToLoad(e.target.checked);
                                      }}
                                    ></Checkbox>
                                  }
                                  label="Wait for page to load"
                                />
                              </FormGroup>
                            </>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: "3px" }}
                        onClick={() => {
                          saveStepBtnClick(index);
                        }}
                      >
                        Save step
                      </Button>
                    </Grid>
                  </Box>
                )}
              </div>
            );
          })}
        </Box>
        <Box
          sx={{
            display: showPlusBtn ? "block" : "none",
            marginTop: "25px",
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <IconButton color="red" onClick={handleAddStepBtnClick}>
              <AddIcon />
            </IconButton>
          </Grid>
        </Box>
        <Box
          sx={{
            display: showPlusBtn ? "block" : "none",
            marginTop: "25px",
          }}
        >
          <Grid
            item
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Button onClick={handleDoneBtnClick}>Save automation</Button>
          </Grid>
        </Box>
        <Box
          sx={{
            display: hideBotNameInputs ? "none" : "block",
            backgroundImage: `url(${RoboWavingImage})`,
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right",
            minHeight: "80vh",
          }}
        >
          <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
            <TextField
              label="Enter a name for your bot"
              variant="standard"
              sx={{ width: "40%" }}
              error={error && !botName}
              onChange={(e) => setBotName(e.target.value)}
              helperText={error && !botName ? error : ""}
            ></TextField>
          </Grid>

          <Grid item xs={12} style={{ textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              style={{ marginTop: "20px" }}
              onClick={handleBotNameBtnClick}
            >
              continue
            </Button>
          </Grid>
        </Box>
      </Box>
    </motion.div>
  );
}

export default BuildAutomation;

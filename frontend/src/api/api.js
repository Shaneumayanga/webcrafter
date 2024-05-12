import axios from "axios";

import { handleError } from "./handleError";

const BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${window.localStorage.getItem("token")}`,
  },
});

const apiLogin = async (email, password) => {
  try {
    const response = await api.post("/user/login", { email, password });
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const apiRegister = async (email, password, user_name) => {
  try {
    const response = await api.post("/user/create", {
      email,
      password,
      user_name,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const apiCreateAutomation = async (body) => {
  try {
    const response = await api.post("/automation/create", body);
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const getUserAutomations = async (body) => {
  try {
    const response = await api.get(
      "/automation/get-automations-for-user",
      body
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const apiRunAutomation = async (automation_id) => {
  try {
    const response = await api.post("/automation/run-automation", {
      automation_id: automation_id,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const apiGetLogsPerAutomation = async (automation_id) => {
  try {
    const response = await api.get(
      `/user/get-logs-for-user/${automation_id}`,
      {}
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const apiToggleAutomationkeepRunning = async (automation_id) => {
  try {
    const response = await api.post(
      "/automation/toggle-automation-keep-running",
      {
        automation_id: automation_id,
      }
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const apiFetchAutomationData = async (automation_id) => {
  try {
    const response = await api.get(
      `/automation/get-automation-by-id/${automation_id}`,
      {}
    );
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

const apiUpdateAutomationSteps = async (automation_id, new_steps) => {
  try {
    const response = await api.put(`/automation/update_automation_steps`, {
      automation_id: automation_id,
      new_steps: new_steps,
    });
    return response.data;
  } catch (error) {
    handleError(error);
    return;
  }
};

export {
  apiLogin,
  apiRegister,
  apiCreateAutomation,
  getUserAutomations,
  apiRunAutomation,
  apiGetLogsPerAutomation,
  apiToggleAutomationkeepRunning,
  apiFetchAutomationData,
  apiUpdateAutomationSteps,
};

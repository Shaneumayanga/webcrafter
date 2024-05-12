const express = require("express");
const router = express.Router();
const middleware = require("../middleware/middleware");
const validation = require("../validation/automation.joi");
const automationService = require("../service/automation.service");
const {
  tokenResponse,
  successResponse,
  errorResponse,
} = require("../reponse/response");

router
  .route("/create")
  .post(
    middleware.validateBody(validation.createAutomation),
    middleware.validateHeader(),
    async (req, res) => {
      try {
        const data = await automationService.createAutomation(
          req.body,
          res.locals.user
        );
        return successResponse(data, res);
      } catch (error) {
        return errorResponse(error, res);
      }
    }
  );

router
  .route("/get-automations-for-user/")
  .get(middleware.validateHeader(), async (req, res) => {
    try {
      const data = await automationService.getAutomations(res.locals.user);
      return successResponse(data, res);
    } catch (error) {
      return errorResponse(error, res);
    }
  });

router
  .route("/get-automations-for-user/")
  .get(middleware.validateHeader(), async (req, res) => {
    try {
      const data = await automationService.getAutomations(res.locals.user);
      return successResponse(data, res);
    } catch (error) {
      return errorResponse(error, res);
    }
  });

router
  .route("/run-automation")
  .post(
    middleware.validateBody(validation.runAutomation),
    middleware.validateHeader(),
    async (req, res) => {
      try {
        const data = await automationService.runAutomation(
          req.body.automation_id
        );
        return successResponse(data, res);
      } catch (error) {
        return errorResponse(error, res);
      }
    }
  );

router
  .route("/toggle-automation-keep-running")
  .post(
    middleware.validateBody(validation.toggleAutomationKeepRunning),
    middleware.validateHeader(),
    async (req, res) => {
      try {
        const data = await automationService.toggleAutomationKeepRunning(
          req.body.automation_id
        );
        return successResponse(data, res);
      } catch (error) {
        return errorResponse(error, res);
      }
    }
  );

router
  .route("/get-automation-by-id/:automation_id")
  .get(middleware.validateHeader(), async (req, res) => {
    try {
      const data = await automationService.getAutomationId(
        req.params.automation_id
      );
      return successResponse(data, res);
    } catch (error) {
      return errorResponse(error, res);
    }
  });

router
  .route("/update_automation_steps")
  .put(middleware.validateHeader(), async (req, res) => {
    try {
      const data = await automationService.updateAutomationSteps(
        req.body.automation_id,
        req.body.new_steps
      );
      return successResponse(data, res);
    } catch (error) {
      return errorResponse(error, res);
    }
  });

module.exports = router;

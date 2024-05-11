const express = require("express");
const router = express.Router();
const userService = require("../service/user.service");
const validator = require("../validation/user.joi");
const middleware = require("../middleware/middleware");
const {
  tokenResponse,
  successResponse,
  errorResponse,
} = require("../reponse/response");

router
  .route("/create")
  .post(middleware.validateBody(validator.createUser), async (req, res) => {
    try {
      const data = await userService.createUser(req.body);
      return successResponse(data, res);
    } catch (error) {
      return errorResponse(error, res);
    }
  });

router
  .route("/login")
  .post(middleware.validateBody(validator.login), async (req, res) => {
    try {
      const data = await userService.login(req.body);
      return tokenResponse(data, res);
    } catch (error) {
      return errorResponse(error, res);
    }
  });

router
  .route("/get-logs-for-user/:automation_id")
  .get(middleware.validateHeader(), async (req, res) => {
    try {
      const data = await userService.userLogs(
        res.locals.user.user_id,
        req.params.automation_id
      );
      return successResponse(data, res);
    } catch (error) {
      return errorResponse(error, res);
    }
  });

module.exports = router;

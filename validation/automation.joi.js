const joi = require("joi");
const config = require("../config/config");

const SubStepSchema = joi.object({
  step_type: joi
    .number()
    .valid(
      config.subStepTypes.click,
      config.subStepTypes.input_text,
      config.subStepTypes.get_text_content
    ),
  data: joi.string(),
  wait_for_new_page: joi.boolean().required(),
});

module.exports.createAutomation = joi.object({
  bot_type: joi.number().required(),
  name: joi.string().required(),
  website_url: joi.string().required(),
  steps: joi.array().items(
    joi.object({
      step_type: joi
        .number()
        .valid(
          config.stepTypes.goto,
          config.stepTypes.search_for_html_element_by_id,
          config.stepTypes.search_for_html_elements_by_class_name,
          config.stepTypes.search_for_html_element_by_custom_query,
          config.stepTypes.click_enter_btn_on_page,
          config.stepTypes.take_screen_shot_of_page
        )
        .required(),
      selector: joi.string(),
      sub_steps: joi.when("step_type", {
        is: joi
          .number()
          .valid(
            config.stepTypes.search_for_html_element_by_id,
            config.stepTypes.search_for_html_elements_by_class_name,
            config.stepTypes.search_for_html_element_by_custom_query
          ),
        then: joi.array().items(SubStepSchema).required(),
      }),
    })
  ),
});

module.exports.runAutomation = joi.object({
  automation_id: joi.string().alphanum().min(24).max(24),
});


module.exports.toggleAutomationKeepRunning = joi.object({
  automation_id: joi.string().alphanum().min(24).max(24),
});

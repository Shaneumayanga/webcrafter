module.exports.stepTypes = {
  goto: 1,
  search_for_html_element_by_id: 2,
  search_for_html_elements_by_class_name: 3,
  search_for_html_element_by_custom_query: 4,
  click_enter_btn_on_page: 5,
  take_screen_shot_of_page: 6,
};

module.exports.subStepTypes = {
  input_text: 1,
  click: 2,
  get_text_content: 3,
};

module.exports.logTypes = {
  error: 1,
  info: 2,
  systemError: 3,
};

//TODO: GET THIS FROM ENV

module.exports.tokenKey = process.env.JWT_SECRET || "key123"

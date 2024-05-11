const puppeteer = require("puppeteer");

const { createDatabaseConnection } = require("../database/database");
const AutomationModel = require("../models/automation.model");
const config = require("../config/config");
const { createLog } = require("../service/log.service");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { v4: uuidv4 } = require("uuid");

createDatabaseConnection();

const handleSubSteps = (
  subSteps,
  element,
  elementSelector,
  page,
  automation
) => {
  return new Promise(async (resolve, reject) => {
    try {
      for (let j = 0; j < subSteps.length; j++) {
        const subStep = subSteps[j];
        switch (subStep.step_type) {
          case config.subStepTypes.click:
            await element.click();
            if (subStep.wait_for_new_page) {
              await waitForNatigation(page,automation);
            }
            break;
          case config.subStepTypes.input_text:
            await element.type(subStep.data);
            const inputValue = await page.$eval(
              elementSelector,
              (input) => input.value
            );

            if (
              inputValue.replace(/\s+/g, "") ===
              subStep.data.replace(/\s+/g, "")
            ) {
              await createLog({
                user_id: automation.user_id,
                automation_id: automation._id,
                log_text: `Typed in successfully : ${subStep.data}`,
                log_type: config.logTypes.info,
              });
              if (subStep.wait_for_new_page) {
                await waitForNatigation(page, automation);
              }
            }
            break;

          case config.subStepTypes.get_text_content:
            const elementText = await page.evaluate(
              (el) => el.textContent.trim(),
              element
            );
            await createLog({
              user_id: automation.user_id,
              automation_id: automation._id,
              log_text: `Got text content from element "${elementText}"`,
              log_type: config.logTypes.info,
            });
            break;
        }
      }

      resolve();
    } catch (error) {
      console.log("handle-sub-steps=error");
      reject(error);
    }
  });
};

const finalResultsScreenShot = (page, automation, isFinal = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pictureUUID = uuidv4();
      await page.screenshot({
        path: `uploads/${pictureUUID}.png`,
        fullPage: true,
      });
      if (isFinal) {
        await createLog({
          user_id: automation.user_id,
          automation_id: automation._id,
          log_text: `Visit http://localhost:8080/uploads/${pictureUUID}.png for the result`,
          log_type: config.logTypes.info,
        });
      } else {
        await createLog({
          user_id: automation.user_id,
          automation_id: automation._id,
          log_text: `Screenshot taken visit : http://localhost:8080/uploads/${pictureUUID}.png`,
          log_type: config.logTypes.info,
        });
      }

      resolve();
    } catch (error) {
      console.log("final-result-ss-error");
      reject(error);
    }
  });
};

const waitForNatigation = (page, automation) => {
  return new Promise(async (resolve, reject) => {
    try {
      await page.waitForNavigation({ waitUntil: "networkidle0" });
      resolve();
    } catch (error) {
      await createLog({
        user_id: automation.user_id,
        automation_id: automation._id,
        log_text: `Error waiting for page to load ${error.message}`,
        log_type: config.logTypes.error,
      });
      reject(error);
    }
  });
  //Navigation timeout of 30000 ms exceeded
};

cron.schedule("*/30 * * * * * ", () => {
  console.log(`running at ${new Date()}`);
  (async () => {
    const automations = await AutomationModel.find({
      is_running: true,
      is_locked: false,
    });

    const automationsisLocked = await AutomationModel.find({
      is_locked: true,
    });

    if (automationsisLocked.length !== 0) {
      console.log("waiting till current que is done");
      return;
    }

    if (automations.length === 0) {
      console.log("no automations to run");
      return;
    }
    console.log(`running ${automations.length} automations`);

    const promises = automations.map(
      (automation) =>
        new Promise(async (resolve, reject) => {
          let browser;
          let page;
          try {
            await AutomationModel.updateOne(
              {
                _id: new mongoose.Types.ObjectId(automation._id),
              },
              {
                is_locked: true,
              },
              {
                new: true,
              }
            );

            browser = await puppeteer.launch();
            page = await browser.newPage();

            await createLog({
              user_id: automation.user_id,
              automation_id: automation._id,
              log_text: `Automation ${automation.name} started running`,
              log_type: config.logTypes.info,
            });

            for (let i = 0; i < automation.steps.length; i++) {
              const step = automation.steps[i];
              switch (step.step_type) {
                case config.stepTypes.goto:
                  try {
                    await page.goto(`${automation.website_url}`);
                    await createLog({
                      user_id: automation.user_id,
                      automation_id: automation._id,
                      log_text: `Navigated to URL ${automation.website_url}`,
                      log_type: config.logTypes.info,
                    });
                  } catch (error) {
                    if (`${error}`.includes(":ERR_NAME_NOT_RESOLVED")) {
                      await createLog({
                        user_id: automation.user_id,
                        automation_id: automation._id,
                        log_text: `Cannot seem to natigate to the url ${automation.website_url} ERR_NAME_NOT_RESOLVED`,
                        log_type: config.logTypes.error,
                      });
                    } else {
                      await createLog({
                        user_id: automation.user_id,
                        automation_id: automation._id,
                        log_text: `Cannot seem to natigate to the url ${error.message}`,
                        log_type: config.logTypes.systemError,
                      });
                      await createLog({
                        user_id: automation.user_id,
                        automation_id: automation._id,
                        log_text: `System error occured for automation id ${automation._id}`,
                        log_type: config.logTypes.error,
                      });
                    }
                    return resolve();
                  }

                  break;

                case config.stepTypes.search_for_html_element_by_id:
                  const elementID = "#" + step.selector;
                  const elementByID = await page.$(elementID);

                  if (!elementByID) {
                    await createLog({
                      user_id: automation.user_id,
                      automation_id: automation._id,
                      log_text: `No element found by the ID ${elementID} .Unable to proceed`,
                      log_type: config.logTypes.error,
                    });
                    return resolve();
                  } else {
                    await createLog({
                      user_id: automation.user_id,
                      automation_id: automation._id,
                      log_text: `Found HTML element by ID ${elementID}`,
                      log_type: config.logTypes.info,
                    });
                  }

                  await handleSubSteps(
                    step.sub_steps,
                    elementByID,
                    elementID,
                    page,
                    automation
                  );

                  break;

                case config.stepTypes.search_for_html_element_by_custom_query:
                  const customQuery = step.selector;
                  const elementByCustomQuery = await page.$(customQuery);

                  if (!elementByCustomQuery) {
                    await createLog({
                      user_id: automation.user_id,
                      automation_id: automation._id,
                      log_text: `No element found by the Query ${customQuery} .Unable to proceed`,
                      log_type: config.logTypes.error,
                    });
                    return resolve();
                  }
                  await handleSubSteps(
                    step.sub_steps,
                    elementByCustomQuery,
                    customQuery,
                    page,
                    automation
                  );
                  break;

                case config.stepTypes.click_enter_btn_on_page:
                  try {
                    await page.keyboard.press("Enter");
                    await createLog({
                      user_id: automation.user_id,
                      automation_id: automation._id,
                      log_text: `Enter pressed on page`,
                      log_type: config.logTypes.info,
                    });
                    await page.waitForNavigation({ waitUntil: "networkidle0" });
                  } catch (error) {
                    await createLog({
                      user_id: automation.user_id,
                      automation_id: automation._id,
                      log_text: `Unable to press enter on page due to ${error}`,
                      log_type: config.logTypes.error,
                    });
                  }
                  break;
                case config.stepTypes.take_screen_shot_of_page:
                  finalResultsScreenShot(page, automation);
                  break;
              }
            }

            resolve();
          } catch (error) {
            await createLog({
              user_id: automation.user_id,
              automation_id: automation._id,
              log_text: `${error.message}`,
              log_type: config.logTypes.systemError,
            });
            await createLog({
              user_id: automation.user_id,
              automation_id: automation._id,
              log_text: `System error occured for automation id ${automation._id}`,
              log_type: config.logTypes.error,
            });
            reject(error);
          } finally {
            if (page) {
              finalResultsScreenShot(page, automation, true);
            }

            await AutomationModel.updateOne(
              {
                _id: new mongoose.Types.ObjectId(automation._id),
              },
              {
                is_running: false,
                is_locked: false,
                last_ran_ended: new Date(),
              },
              {
                new: true,
              }
            );
          }
        })
    );

    await Promise.allSettled(promises);
    console.log("after all done");
  })();
});

cron.schedule("*/10 * * * * * ", async () => {
  const automations = await AutomationModel.find({
    is_running: false,
    is_locked: false,
    keep_running: true,
  });

  const promises = automations.map(
    (automation) =>
      new Promise(async (resolve, reject) => {
        try {
          await AutomationModel.updateOne(
            {
              _id: new mongoose.Types.ObjectId(automation._id),
            },
            {
              is_running: true,
            },
            {
              new: true,
            }
          );
          resolve();
        } catch (error) {
          console.log("error", error);
          reject(error);
        }
      })
  );

  await Promise.allSettled(promises);
});

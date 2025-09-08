# Project Setup Guide


## Using docker

`docker compose up`

## Introduction

This is a pet project that I built to play around with Puppeteer; it's basically a "step-by-step" automation builder with a UI that runs on Puppeteer.

<img width="776" height="640" alt="Screenshot 2025-09-08 at 17 33 45" src="https://github.com/user-attachments/assets/5a01973b-a422-4a2a-a27e-42ed6f440bc3" />

<img width="900" height="616" alt="Screenshot 2025-09-08 at 17 35 06" src="https://github.com/user-attachments/assets/5a38fc25-c8fe-447f-97f2-02324509cf51" />


This project consists of separate backend and frontend components. The backend is located in the project root, while the frontend is in the /frontend folder.

## Backend Setup

1. Navigate to the root folder containing the package.json file.
2. Run `npm install` to install the necessary dependencies.
3. Create a `.env` file if it doesn't exist already.
4. Add the following environment variables to the `.env` file, change the MONGODB_URI as you wish:
   ```plaintext
   PORT=8080
   JWT_SECRET=key123
   MONGODB_URI=mongodb://127.0.0.1:27017/web-scraper
5. If needed to allow Origins with cors , you can add those to `app.js`


## Set up the frontend 

1. Navigate to the /frontend folder 
2. Run `npm install` to install the necessary dependencies.
3. If needed . To change the base url that points to the backend go to `frontend\src\api\api.js`


## Start the bot service

from the root folder run `node bot-service/bot-service.js` If this is not run from the project directory it will not work

# Project Setup Guide


## Using docker

`docker compose up`

## Introduction

This is a pet project that I built to play around with Puppeteer; it's basically a "step-by-step" automation builder with a UI that runs on Puppeteer.


<img width="1440" height="639" alt="Screenshot 2025-09-08 at 21 17 59" src="https://github.com/user-attachments/assets/2ae6bc88-1602-4f90-8e9d-50137fbc71dc" />

<img width="1440" height="642" alt="Screenshot 2025-09-08 at 21 18 55" src="https://github.com/user-attachments/assets/bd3220f5-855d-40fd-98fc-b8840802d7a9" />

<img width="1439" height="637" alt="Screenshot 2025-09-08 at 21 20 23" src="https://github.com/user-attachments/assets/bfee2b3c-cbc3-438e-99c3-95fc6d37b436" />

 <img width="1433" height="630" alt="Screenshot 2025-09-08 at 21 20 48" src="https://github.com/user-attachments/assets/1cc076a4-c94d-4e5d-bba8-4f616e8e7678" />

<img width="1434" height="632" alt="Screenshot 2025-09-08 at 21 21 18" src="https://github.com/user-attachments/assets/c7287d93-be78-4ed0-bbb2-1c980b7ac3a2" />

<img width="1439" height="637" alt="Screenshot 2025-09-08 at 21 21 27" src="https://github.com/user-attachments/assets/03d41922-e15c-452e-9e88-330dccaaf2b5" />



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

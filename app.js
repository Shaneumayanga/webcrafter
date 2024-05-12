require('dotenv').config()
const express = require("express");
const app = express();

const cors = require("cors"); 

const PORT = process.env.PORT;

const { createDatabaseConnection } = require("./database/database");

createDatabaseConnection();

app.use(express.json());

app.use('/uploads', express.static('uploads'));


app.use(
  cors({
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200, 
  })
);

app.use("/api/user", require("./controller/user.controller"));
app.use("/api/automation", require("./controller/automation.controller"));

app.listen(PORT, () => console.log(`App running on port ${PORT}`));

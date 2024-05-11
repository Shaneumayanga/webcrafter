const mongoose = require("mongoose");

module.exports.createDatabaseConnection = ()=> {
  mongoose.connect(`mongodb://127.0.0.1:27017/web-scraper`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
}


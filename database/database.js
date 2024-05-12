const mongoose = require("mongoose");

module.exports.createDatabaseConnection = () => {
  mongoose.connect(`${process.env.MONGODB_URI}`, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
};

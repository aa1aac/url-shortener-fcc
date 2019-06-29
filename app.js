const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const { router } = require("./routes");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("views"));
app.use("/", router);

const { MONGODB_URI } = process.env;
const PORT = process.env.PORT || 3000;

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true })
  .then(result => {
    app.listen(PORT, () => {
      console.log(`deployed on port ${PORT}`);
    });
  })
  .catch(err => {
    console.log(err);
  });

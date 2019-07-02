const mongoose = require("mongoose");

const { Schema } = mongoose;

const shortUrl = new Schema({
  original_url: { type: String, required: true },
  short_url: { type: String, required: true }
});

module.exports = mongoose.model("Shorten", shortUrl);

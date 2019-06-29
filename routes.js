const express = require("express");

const shortener = require("./controller/urlShortener");

const router = express.Router();

router.get("/", shortener.getIndex);

router.post("/api/short-url/new", shortener.postNew);

module.exports = { router };

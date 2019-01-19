// basic requirements
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//connect to the database
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/shortUrls");
//
const shortUrL = require("./models/shortUrl");

// create app for express
const app = express();

// add middleware to the app
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(__dirname + "/public"));

//create database entry point
app.get("/new/:urlToShorten(*)", (req, res, next) => {
  var { urlToShorten } = req.params;
  console.log(urlToShorten);

  //regex for url
  let expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
  let regex = expression;

  if (regex.test(urlToShorten) === true) {
    let short = Math.floor(Math.random() * 100000).toString();
    let data = new shortUrL({
      originalUrl: urlToShorten,
      shorterUrl: short
    });

    data.save(err => {
      if (err) {
        return res.send("Error saving to database");
      }
    });
    return res.json(data);
  } else {
    urlToShorten = "failed";
    return res.json(data);
  }
});

// query database and redirect to the original
app.get("/:urlToForward", (req, res, next) => {
  var shorterUrl = req.params.urlToForward;
  shortUrL.findOne({ shorterUrl }, (err, data) => {
    if (err) return res.send("Error reading database");
    var re = new RegExp("^(http|https)://", "i");
    var stringToCheck = data.originalUrl;
    if (re.test(stringToCheck)) {
      res.redirect(301, data.originalUrl);
    } else {
      res.redirect(301, "http://" + data.originalUrl);
    }
  });
});

// listen at port _____
app.listen(process.env.PORT || 3000, () =>
  console.log("listening on port " + process.env.PORT || "3000")
);
// //Require Express
// const express = require("express");
// //Create our app and instantiate instances
// const app = express();
// //Require additional packages
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const mongoose = require("mongoose");
// //Retrieves the template/model for shortUrl schema
// const shortUrl = require("./models/shortUrl");
// //Instantiante instances
// app.use(bodyParser.json());
// app.use(cors());
// //Connect to our database
// mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/shortUrls");

// //Get public folder allowing us to use the files for the front send
// app.use(express.static(__dirname + "/public"));
// app.get("/new/:urlToShorten", (req, res, next) => {
//   var urlToShorten = req.params.urlToShorten;
//   //Check to see if passed in url is in correct form
//   var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
//   var regex = expression;

//   if (regex.test(urlToShorten)) {
//     var short = Math.floor(Math.random() * 1000000).toString();
//     // console.log(short);
//     //Create object to send to the database
//     var data = new shortUrl({
//       originalUrl: urlToShorten,
//       shorterUrl: short
//     });
//     //Saves to database and throws error message if it fails
//     data.save(err => {
//       if (err) {
//         return res.send("Error saving to database");
//       }
//     });
//     return res.json(data);
//   }
//   var data = new shortUrl({
//     originalUrl: "urlToShorten",
//     shorterUrl: "Invalid URL"
//   });
//   return res.json(data);
// });
// //Query database and forward to url
// app.get("/:urlToForward", (res, req, next) => {
//   // Stores the value of param
//   var shorterUrl = res.params.urlToForward;
//   shortUrl.findOne({ shorterUrl: shorterUrl }, (err, data) => {
//     if (err) return res.send("Error reading database");
//     var re = new RegExp("^(http|https)://", "i");
//     var stringToCheck = data.originalUrl;
//     if (re.test(stringToCheck)) {
//       res.redirect(301, data.originalUrl);
//     } else {
//       res.redirect(301, "http://" + data.originalUrl);
//     }
//     response.end();
//   });

//   res.redirect("https://www.google.com");
// });
// // app.get("/:urlToForward", (req, res, next) => {
// //   var shorterUrl = req.params.urlToForward;
// //   shortUrLs.findOne({ shorterUrl }, (err, data) => {
// //     if (err) return res.send("Error reading database");
// //     var re = new RegExp("^(http|https)://", "i");
// //     var stringToCheck = data.originalUrl;
// //     if (re.test(stringToCheck)) {
// //       res.redirect(301, data.originalUrl);
// //     } else {
// //       res.redirect(301, "http://" + data.originalUrl);
// //     }
// //   });
// // });
// //Listen to see if everything is working and launching properly locally or on heroku
// app.listen(process.env.PORT || 3000, () => {
//   console.log("Express server running");
// });

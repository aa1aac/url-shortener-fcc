const { URL, parse } = require("url");
const uniqueId = require("uniqid");

const Shorten = require("../model/shortUrl");

exports.getIndex = (req, res, next) => {
  res.sendFile("index.html");
};

exports.postNew = (req, res, next) => {
  const stringIsAValidUrl = (uri, protocols) => {
    try {
      new URL(uri);
      const parsed = parse(uri);
      return protocols
        ? parsed.protocol
          ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
          : false
        : true;
    } catch (err) {
      return false;
    }
  };
  if (!stringIsAValidUrl(req.body.url, ["http", "https"])) {
    res.json({ error: "invalid URL" });
  }
  if (stringIsAValidUrl(req.body.url, ["http", "https"])) {
    let short_url = uniqueId();
    Shorten.findOne({ original_url: req.body.url })
      .then(result => {
        if (!result) {
          const shorten = new Shorten({
            original_url: req.body.url,
            short_url
          });
          shorten
            .save()
            .then(value => {
              res.json(value);
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          res.json({ result });
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};

exports.redirectUrl = (req, res, next) => {
  const shortUrl = req.params.short;
  Shorten.findOne({ short_url: shortUrl }).then(result => {
    if (result) {
      res.redirect(`${result.original_url}`);
    } else {
      res.json({ error: "no such short url found" });
    }
  });
};

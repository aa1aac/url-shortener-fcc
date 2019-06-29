const { URL, parse } = require("url");

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
};

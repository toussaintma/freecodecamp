// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  console.log("Received request for this time:", req.params.date);
  if (req.params.date === undefined) {
    const d = new Date();
    res.json({ unix: d.getTime(), utc: d.toUTCString() });
  } else {
    console.log("found input:" + req.params.date.toString());
    let d;
    if (isNaN(req.params.date)) {
      d = new Date(req.params.date);
    } else {
      d = new Date(Number(req.params.date));
    };
    console.log("computed date " + d);
  
    if (d.toString() === 'Invalid Date') {
      let o = { error : "Invalid Date" };
      console.log(o);
      res.send(o);
    } else {
      console.log(JSON.stringify({unix: d.getTime(), utc: d.toUTCString()}));
      res.json({unix: d.getTime(), utc: d.toUTCString()});
    };
  };
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

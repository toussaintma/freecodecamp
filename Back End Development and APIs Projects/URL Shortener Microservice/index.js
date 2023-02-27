require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const url = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const arr = []; // shared array to record shortened urls

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/shorturl', function(req, res) {
  // get parameters
  const ori = req.body.url;
  let bad_input = false;
  
  // validate parameters
  if (ori == undefined) {
    bad_input = true;
  } else {
    // split url
    let ori_url;
    try {
      ori_url = new url.URL(ori);
    } catch (err) {
      bad_input = true;
    }
    if (!bad_input) {
      dns.lookup(ori_url.hostname, (err, address, family) => {
        if (err) {
          bad_input = true;
          console.log(err.code + ' bad host found ' + ori_url.hostname);
        }
          
        if (bad_input) {
          // handle unformatted url
          res.json({ error: 'invalid url' });
        } else {
          // compute short url
          let result;
          result = arr.findIndex(el => el == ori_url.href);
          if (result == -1) {
            arr.push(ori_url);
            result = "" + (arr.length - 1);
          };
          res.json({ original_url : ori_url.href, short_url : result });
        }
      });
    } else {
      console.log('bad url found ' + ori);
      res.json({ error: 'invalid url' });
    };
  };      
});

app.get('/api/shorturl/:short', function(req, res) {
  const short = req.params.short;
  if (short == undefined) {
    res.json({ error: 'invalid url' });
  } else if (Number(short) < arr.length) {
    const result = arr[Number(short)];
    console.log('found url ' + result);
    // do the redirect
    res.redirect(result);
  };
});
  

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

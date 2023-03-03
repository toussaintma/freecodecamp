const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require('mongoose')

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// all endpoints return {error: "error message"} in case of error

const mongoConnect = mongoose.connect(process.env['MONGO_URI'], {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({username: {type: String, unique: true}}); // we will use _id as identifier
const User = mongoose.model('User', userSchema);

const exerciseSchema = new mongoose.Schema({userid: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}, date: Date, duration: Number, description: String});
// userid will include _id from userSchema
// beware must do this before saving date after change: doc.markModified('dueDate');
const Exercise = mongoose.model('Exercise', exerciseSchema);

app.use(express.urlencoded({extended: true}))
// needed to decode body of POST queries

//users routes
app.post('/api/users', (req, res) => {
  if (req.body.username == undefined) {
     res.json({error: "Missing username parameter"});
  } else {
    const u = new User({username: req.body.username});
    user = u.save((err, doc) => {
      if (err) {
        res.json({error: 'Error: ' + err + ' while writing ' + req.body.username + ' to database'});
      } else {
        res.json({username: doc.username, _id: doc._id});
      }
    });    
  };
});

app.get('/api/users', (req, res) => {
  User.find().select('username _id').exec((err, docs) => {
    if (err) {
      res.json({error: 'Error: ' + err + ' while reading users from database'});
    } else {
      res.json(docs);
    }
  });
});

//exercises routes 
app.post('/api/users/:_id/exercises', (req, res) => {
  if (req.body.description == undefined || req.body.duration == undefined) {
     res.json({error: "Missing description or duration parameter" + req.body});
  } else {
    let exDate;
    if (req.body.date == undefined) {
      exDate = new Date();
    } else {
      exDate = new Date(req.body.date);
    };
    // let's query for the user name
    // create the object to return by hand 
    User.findById(req.params._id).select('username').exec((err, element) => {
      if (err) {
        res.json({error: 'Error: ' + err + ' user not found'});
      } else {
        const e = new Exercise({userid: req.params._id, description: req.body.description, duration: req.body.duration, date: exDate.toDateString()});
        ex = e.save((err, doc) => {
          if (err) {
            res.json({error: 'Error: ' + err + ' while writing exercise ' + req.params + ' to database'});
          } else {
            res.json({
              username: element.username, 
              description: doc.description,
              duration: doc.duration,
              date: doc.date.toDateString(),
              _id: element._id
            });
          }
        }); 
      }
    });
  };
});


// logs management
app.get('/api/users/:_id/logs', (req, res) => {
  const query = Exercise.find({userid: req.params._id}).populate('userid', 'username _id');
  if (req.query.from != undefined) {
    query.where('date').gt(new Date(req.query.from));// TODO compare with Date
  }
   if (req.query.to != undefined) {
    query.where('date').lt(new Date(req.query.to));// TODO compare with Date
  }
   if (req.query.limit != undefined) {
    query.limit(Number(req.query.limit));
  }
  
  query.select('description duration date').exec((err, docs) => {
    if (err) {
      res.json({error: 'Error: ' + err + ' while reading users from database'});
    } else {
      //console.log(docs);
      let username;
      if (docs.length == 0) {
        const userDoc = User.findById(req.params._id, (err, doc) => {
          username = doc.username;
          let result = {
            username: username, 
            count: 0,
            _id: req.params._id,
            log: [],
          };
          res.json(result);
        });        
      } else {
        username = docs[0].userid.username;
        let result = {
          username: username, 
          count: docs.length,
          _id: req.params._id,
          log: [],
        };
        const cleanArray = docs.map((el) => {
          return {
            description: el.description,
            duration: el.duration,
            date: el.date.toDateString() 
          };
        });
        result.log = cleanArray;
        res.json(result);
      }
    }
  });
});
// GET /api/users/:_id/logs?[from][&to][&limit]
// query by _id and filter by dates and limit


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})


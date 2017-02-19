var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var cron = require("node-schedule");
var rest = require("restling");
var ObjectID = mongodb.ObjectID;


var PAIRS_COLLECTION = "pairs";
var FONTS_COLLECTION = "fonts";

var app = express();
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;

// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI, function (err, database) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = database;
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
  });
});

//Schedule update of google font list
var rule = new cron.RecurrenceRule();
  rule.minute = 55;
  rule.hour = 23;
cron.scheduleJob(rule, function(){
  console.log('Updating google fonts');
  rest.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyC9S3sxTATaa0P4Fx7eXGTjJoCsC-GKpGw').then(function(result){
    db.collection(FONTS_COLLECTION).remove();

    var updatedFonts = result.data;

    db.collection(FONTS_COLLECTION).insertOne(updatedFonts, function(err, doc) {
      if (err) {
        console.log('Adding updated google fonts failed.');
      } else {
        console.log('Adding updated google fonts was successful.');
      }
    });

    }, function(error){
      console.log(error.message);
    });
});

//-------------//
//--Endpoints--//
//-------------//

// Find all pairs
app.get("/pairs", function(req, res) {
  db.collection(PAIRS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get pairs.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//Create new pair
app.post("/pairs", function(req, res) {
  var newPair = req.body;
  newPair.createDate = new Date();

  if (!(req.body.primFont || req.body.secFont)) {
    handleError(res, "Invalid user input", "Must provide both a primary and secondary font.", 400);
  }

  db.collection(PAIRS_COLLECTION).insertOne(newPair, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new pair.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});

//Add like
app.put("/pairs/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(PAIRS_COLLECTION).updateOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to add like.");
    } else {
      res.status(204).end();
    }
  });
});

//Get all available fonts
app.get("/fonts", function(req, res) {

  db.collection(FONTS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get pairs.");
    } else {
      res.status(200).json(docs);
    }
  });
});

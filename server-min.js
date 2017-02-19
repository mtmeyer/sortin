var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;


var TOPICS_COLLECTION = "topics";

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

//-------------//
//--Endpoints--//
//-------------//

// Find all topics
app.get("/topics", function(req, res) {
  db.collection(TOPICS_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get topics.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//Create new topic
app.post("/topics", function(req, res) {
  var newTopic = req.body;
  newTopic.createDate = new Date();

  if (!(req.body.topicName)) {
    handleError(res, "Invalid user input", 400);
  }

  db.collection(TOPICS_COLLECTION).insertOne(newTopic, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new topic.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });
});



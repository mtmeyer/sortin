var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;


var NOTES_COLLECTION = "notes";

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

// Find all notes
app.get("/notes", function(req, res) {
  db.collection(NOTES_COLLECTION).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get notes.");
    } else {
      res.status(200).json(docs);
    }
  });
});

//Create new note
app.post("/notes", function(req, res) {
  var newNote = req.body;
  newNote.createDate = new Date();

  if (!(req.body.noteName)) {
    handleError(res, "Invalid user input", 400);
  }

  db.collection(NOTES_COLLECTION).insertOne(newNote, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to create new note.");
    } else {
      res.status(201).json(doc.ops[0]);
    }
  });

//Get specific note
app.get("/api/notes/:id", function(req, res) {
  db.collection(NOTES_COLLECTION).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get note");
    } else {
      res.status(200).json(doc);
    }
  });
});
});

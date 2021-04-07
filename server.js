// importing express dependency into our project
const express = require("express");
// intializing express functionality into app variable to use it
const app = express();
// importing and setting up our mongodb database to
const MongoClient = require("mongodb").MongoClient;
// Setting up port
const PORT = 2121;
// setting up dotenv so our environment variables can be configured from the
// .env file
require("dotenv").config();

// creating variables for our database, connection string and database name
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Setting up our database connection, using the connection string
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // When the promise is resolved, .then logs a message in cli on succussfull connection
  .then((client) => {
    console.log(`Hey, connected to ${dbName} database`);
    // here we configure our database name into the db variable
    db = client.db(dbName);
  })
  // The catch block logs any errors if anything goes wrong during db connection
  .catch((err) => {
    console.log(err);
  });

// This line tells express which template engine to use, in this case EJS,
// it requires a template engine to be installed (dependency) & this template engine
// feels responsible for files with .ejs extension
app.set("view engine", "ejs");
// Express by default does not allow us to serve static files, We need to
// enable it with this code, express looks up the files here
app.use(express.static("public"));
// ITs a built in middleware function in express, It parses incoming reqs
// with urlencoded payloads and its based on bodyparser

// I DONT KNOW HOW THE URLUNCODED WORKS & WHAT IS THE `EXTENDED: TRUE` MEANS
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// The app.get() function routes the HTTP GET Requests to the path which is
//  being specified with the specified callback function which takes two params
// request and response
// Next we store all of the data/documents from the database/collection as an array into
// the todoItems variable and store the items that are marked as uncomplete into `itemsLeft`
// we then render our ejs file with the all of our todo items and the number of items left
app.get("/", async (req, res) => {
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
});
// Here we setting up our database collection and plug our data into the db with
// insertOne. We create a new object with two properties `todo` with a value of `todoItem`
// and `completed` with a value of false
// Everytime we submit our form and when our POST request hear it, we create a new document
// that has a `todo` and `completed` properties, when its resolved we log a message in console
// and redirect to the home route
app.post("/createTodo", (req, res) => {
  db.collection("todos")
    .insertOne({ todo: req.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo has been added!");
      res.redirect("/");
    });
});
// We go into our db `todo` and using updateOne method we set up the matching
// value to a new property and set its `completed` status to true in the /markComplete
//  route We then log a message confirming the same.
app.put("/markComplete", (req, res) => {
  db.collection("todos")
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: true,
        },
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      // i dont know wheat this does
      res.json("Marked Complete");
    });
});

// Here we go into the /undo route and into our db and use the updateOne method to
// change the value of `todo` property to false
app.put("/undo", (req, res) => {
  db.collection("todos")
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: false,
        },
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      // i dont understand what this does
      res.json("Marked Complete");
    });
});
// We go into our db collection and using the deleteOne method we delete the todo item
// with the matching variable rainbowUnicorn, this lets us delete items from our todo list
// and from our database, and confirms the same by loggin msg in console
app.delete("/deleteTodo", (req, res) => {
  db.collection("todos")
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      console.log("Deleted Todo");
      res.json("Deleted It");
    })
    .catch((err) => console.log(err));
});

// We setup our application to start in the selected port
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running, you better catch it!");
});

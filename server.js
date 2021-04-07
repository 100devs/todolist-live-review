// Variable declaration assigned to bringing in the express package.
const express = require("express");
// Variable declaration assigned to an express instance as app
const app = express();
// Variable declaration assigned to requiring the mongodb package and the MongoClient (property? class function?)
const MongoClient = require("mongodb").MongoClient;
// Variable declaration assigning a port number
const PORT = 2121;
// Requiring dotenv and calling it's config method
require("dotenv").config();

// Declaring variables. db to nothing currently, the connection string to a process environment variable, and the name of the database
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// MongoClient connect method call passing in the connection string and an option for Unified Topology (not certain of this at the moment)
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  // Chaining a then call which collects the client info as an anonymous function and console logs the connected db name and setting the db variable to connected client db object
  .then((client) => {
    console.log(`Hey, connected to ${dbName} database`);
    db = client.db(dbName);
  })
  // catch method call passing the error to the console
  .catch((err) => {
    console.log(err);
  });

// Sets the view engine for the app instance as EJS
app.set("view engine", "ejs");
// Indicates to express the public folder to use as a bucket for static files to be used by ejs/html pages, etc.
app.use(express.static("public"));
// Indicates an extended option to the urlencoded method of express to be use in the app instance.
app.use(express.urlencoded({ extended: true }));
// Uses the express json method call in the app instance.
app.use(express.json());

// App GET method for retrieving information from the database. This GET request is triggered on the homepage "/".
// It calls an async function passing the request and result. Renders the result to the index.ejs file and passes the awaited information received from the database
app.get("/", async (req, res) => {
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
});

// App PUT method. It is triggered from the "/createTodo" action. Passes request and response to call the database and inserts a new todo item, initializes the completed property to false. The result is then logged to the console and app is redirected to the homepage
app.post("/createTodo", (req, res) => {
  db.collection("todos")
    .insertOne({ todo: req.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo has been added!");
      res.redirect("/");
    });
});

// App PUT method. It is triggered from the "/markComplete" action. Passes request and response to call the database to update the matched item from the request body and sets the completed property to true
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
    // the result of the above call is then console logged as completed
    .then((result) => {
      console.log("Marked Complete");
      res.json("Marked Complete");
    });
});

// App PUT method. It is triggered from the "/undo" action. Passes request and response to call the database collection to flip the completed property back to false
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
    // the result of the above call is then console logged as completed
    .then((result) => {
      console.log("Marked Complete");
      res.json("Marked Complete");
    });
});

// App DEL method. It is triggered from the "/deleteTodo" action. Passes request and response to call the database collection and deletes the included request body information. It then console logs the completed Delete action once the promise is resolved.
app.delete("/deleteTodo", (req, res) => {
  db.collection("todos")
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      console.log("Deleted Todo");
      res.json("Deleted It");
    })
    // catch method that console logs the passed in error.
    .catch((err) => console.log(err));
});

// App listen method call. Passes in an OR conditional which either grabs the process environment variable for the PORT or the hardcoded PORT at the top of this file. Callback function console logs that the server is now running :)
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running, you better catch it!");
});

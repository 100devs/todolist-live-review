// Pulling in the express module
const express = require("express");
// Assigning the express module to the variable 'app'
const app = express();
// Pulling in the mongodb module
const MongoClient = require("mongodb").MongoClient;
// Assigning a port number to the variable PORT
const PORT = 2121;
// Pulling in the dotenv module
require("dotenv").config();

// Declaring a few database variables and assigning one to the env variable that contains your database login key
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";
// Setting up the Mongo database connection
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Hey, connected to ${dbName} database`);
    db = client.db(dbName);
  })
  .catch((err) => {
    console.log(err);
  });
// Middleware setting ejs as the templating language, your public folder as the location of static files, and using the built-in express parsers for urlencoded bodies and json.
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Async await function to handle the GET request that fetches the current list of todo items from db and renders them via the ejs file.
app.get("/", async (req, res) => {
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
});

// Function that handles POST requests to add new todo items to the db and then reloads the page.
app.post("/createTodo", (req, res) => {
  db.collection("todos")
    .insertOne({ todo: req.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo has been added!");
      res.redirect("/");
    });
});

// Function for PUT requests that updates items in the db as complete.
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
      res.json("Marked Complete");
    });
});

// Function for PUT requests that undo an item in the db being marked complete.
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
      res.json("Marked Complete");
    });
});

// Function for DELETE requests to remove items from the db.
app.delete("/deleteTodo", (req, res) => {
  db.collection("todos")
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      console.log("Deleted Todo");
      res.json("Deleted It");
    })
    .catch((err) => console.log(err));
});

// This tells your server to listen for activity on the PORT assigned at the top: 2121
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running, you better catch it!");
});

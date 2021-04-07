// importing express dependency into our project
const express = require("express");
// intializing express functionality into app variable to use it
const app = express();
// importing and setting up our mongodb database to use
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

app.get("/", async (req, res) => {
  try {
    const todoItems = await db.collection("todos").find().toArray();
    const itemsLeft = await db
      .collection("todos")
      .countDocuments({ completed: false });
    res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
  } catch (err) {
    console.log(err);
  }
});

app.post("/createTodo", (req, res) => {
  db.collection("todos")
    .insertOne({ todo: req.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo has been added!");
      res.redirect("/");
    });
});

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

app.delete("/deleteTodo", (req, res) => {
  db.collection("todos")
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      console.log("Deleted Todo");
      res.json("Deleted It");
    })
    .catch((err) => console.log(err));
});

app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running, you better catch it!");
});

// import express
const express = require("express");
// Use express constructor function to initialize an express object??
const app = express();
// import and use the MongoClient Client
const MongoClient = require("mongodb").MongoClient;
// sets the port to be 2121
const PORT = 2121;
// Can now use environment config files with a .env extension
require("dotenv").config();

// initializing db, connectionString and dbName variables
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// Connect to the database with our MongoClient.connect method, passing in our connection string and a few options
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    //   Outputs the fact that database has connected once the connect method resolves
    console.log(`Hey, connected to ${dbName} database`);
    // Once we have logged in, we select the database we want to connect
    db = client.db(dbName);
  })
  .catch((err) => {
    //   If there is an error, log it
    console.log(err);
  });

// Use ejs to render our templates
app.set("view engine", "ejs");
// Middleware section here
// Public states that anything in the public folder can be readily called
app.use(express.static("public"));
// I believe this helps parse the body portion of requests
app.use(express.urlencoded({ extended: true }));
// Converts json to JavaScript objects
app.use(express.json());

// client login > database > collection > documents (rows)
// Handle a get request
app.get("/", async (req, res) => {
  // Gets and waits for the full list of documents from our collection
  const todoItems = await db.collection("todos").find().toArray();
  //   Counts the number of documents that have the completed property set to false
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // renders the ejs file, while setting the zebra property to todoItems, and left to itemsLeft
  res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
});

// Executed when a post request to the /createTodo path is created
app.post("/createTodo", (req, res) => {
  // access the todos collection and insert this post item
  db.collection("todos")
    .insertOne({ todo: req.body.todoItem, completed: false })
    .then((result) => {
      // Once we have inserted and the above method resolves, log todo has been added
      console.log("Todo has been added!");
      //   Send a get request to /
      res.redirect("/");
    });
});

// Modify an existing item and mark an item as being complete. Only gets executed if the todo item does not have a class of complete
app.put("/markComplete", (req, res) => {
  // In the todos collection, find the item with that specific text and "set" completed to true
  db.collection("todos")
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: true,
        },
      }
    )
    // Once the above code resolves, on the server end, out put Market completed
    .then((result) => {
      console.log("Marked Complete");
      //   To the browser send a json response of Marked Complete
      res.json("Marked Complete");
    });
});

// Modify an existing to do item, but this only gets executed on todo items with a class of completed
app.put("/undo", (req, res) => {
  db.collection("todos")
    //   Find the todo item with the matching text, and "set" completed property to false
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: false,
        },
      }
    )
    // Once above code resolves, output on the server "Marked Complete"
    .then((result) => {
      console.log("Marked Complete");
      //   Send a JSON response stating Marked Complete
      res.json("Marked Complete");
    });
});
// executes when there is a delete request on the /deleteTodo route
app.delete("/deleteTodo", (req, res) => {
  // In the todos collection, delete the first Item that has todo of rainbowUnicorn property
  db.collection("todos")
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      // If success, send a message saying that the todo was deleted.
      console.log("Deleted Todo");
      //   Send a json response back. Converts the string "Deleted It" into JSON
      res.json("Deleted It");
    })
    // Catches any errors
    .catch((err) => console.log(err));
});

// Listens on the port of the environment port first. If there is no environment port, then use the PORT defined in this document which is 2121
app.listen(process.env.PORT || PORT, () => {
  // Output the below message indicating that the app is listening for a command
  console.log("Server is running, you better catch it!");
});

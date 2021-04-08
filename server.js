// Use express in the server.js file by requiring it!
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const PORT = 2121;
require("dotenv").config();

// remember to add the ip address on MondoDB!!!! - make sure that it is whitelisted
// "you cannot get in the club if you are not on the list!"

// storing the connection to our database
let db,
  dbConnectionStr =
    "mongodb+srv://user-demo:bentoSamuel@cluster0.cciyh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
dbName = "todo";

// Connecting to the database - MongoDB
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Hey, connected to ${dbName} database`);
    // connection to my database
    db = client.db(dbName);
  })
  .catch((err) => {
    console.log(err);
  });

// Setting up the server -- the things that the server is going to use
// Setting the view engine to Embedded JavaScript template engine. This will allow us to (render or) generate html that contains dinamic data (or our quotes)
app.set("view engine", "ejs");
// Telling Express to make this folder 'public' accessible to the public. Now you dont need to route your files if it is in the public folder
app.use(express.static("public"));
// These will enable us so we can look at the request that was send. Pullinfo from request
// Make sure that you place this before your CRUD handlers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET REQUEST //
// simple get request! The '/' is the endpoint and the async the callback -- whenever the server hears a get request it will respond with this here!
// here we need to go to our database, get the data and plug it on ejs so it can spill out html
app.get("/", async (req, res) => {
  // go to our collection, find the data (the 'todos'), turn it into an array!
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  // pass in this object inside the ejs file. we are calling the object zebra is this case here.
  // the html is sent as a response
  //!!!!!!! --- how is the client side getting my javaScript as well as the HTML?????
  // !!!! ---- since the javascript file is inside the public folder, any of the static files that get requested we do not need a rout for it!!! app.use(express.static("public"));
  res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
});

// POST REQUEST //
// create route for our post method - the action on the form action ="/createTodo". Once we hear the request it fires the req and res function!
app.post("/createTodo", (req, res) => {
  // lets send the data to mongo - push it to the server!
  // use the connection to our database stored in the db variable. Create a collection 'todos'. Use the insertOne({}) method.
  // we will insert the actual todo and wheather or not the task was completed.
  db.collection("todos")
    // todoItem is the property name that is comming from our form!
    .insertOne({ todo: req.body.todoItem, completed: false })
    // a promise is returned... so we need our then method!
    .then((result) => {
      console.log("Todo has been added!");
      // respond to this promise by REFRESHING the page!
      res.redirect("/");
    });
});

// PUT REQUEST //
app.put("/markComplete", (req, res) => {
  // go to the database, in the collections todos, update one document in the collection where the text matches the object that we clicked on.
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

// Setting up the delete route on our server! -- in the client side (main.js) we fetch to the route - fetch('deleteTodo').
// ... so that is the route that we use in our server
// !!! this route will fire when we hear the fetch in our main.js
app.delete("/deleteTodo", (req, res) => {
  // !!!!! --- fix this. not getting the value for the req.body.rainbowUnicorn
  console.log(req.body.rainbowUnicorn);
  // check if we the text is matching
  // now we delete something from our database
  // when building our route, we go to our database, find the collection 'todos', deleteOne document where the todo property is equals to whatever the text we clicked on -- 'rainbowUnicorn' property value from main deleteTodo.
  db.collection("todos")
    // delete the one that the property matches req.body.rainbowUnicorn
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      console.log("Deleted Todo");
      res.json("Deleted It");
    })
    .catch((err) => console.log(err));
});

// create a server that the browser can listen to by using the Express's listen method
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running, you better catch it!");
});

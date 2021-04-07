// importing the express module
const express = require("express");

// creating a variable that can access expresses methods
const app = express();

// allowing our local files to connect to MongoDB
const MongoClient = require("mongodb").MongoClient;

// setting up a port so our file can be connected on a localhost. This can be virtually any number.
const PORT = 2121;

// importing and configuring our .env files, which will hold our secrets
require("dotenv").config();

// declaring our database, creating our variable so our personal MongoDB cluster can be accessed without revealing sensitive info, and assigning a name for our database that will be accessed
let db,
  dbConnectionStr = process.env.DB_STRING,
  dbName = "todo";

// enabling our server to access our MongoDB acct and assigning our db variable to connect to our already assigned database name (dbName). We make a promise to ensure that our server is receiving info from our db
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    console.log(`Hey, connected to ${dbName} database`);
    db = client.db(dbName);
  })
  .catch((err) => {
    console.log(err);
  });

// setting up our server to be able to read our ejs file
app.set("view engine", "ejs");

// telling express that any static files we want rendered will be found in our 'public' directory
app.use(express.static("public"));

// telling express to decode requests by parsing the data on the body
app.use(express.urlencoded({ extended: true }));

// parses json data
app.use(express.json());

// tells our server what to do when the root is accessed. We use async await to avoid the pyramid of doom.
// in todoItems, we are asking the server to access MongoDB and look for a collection named 'todos'. Once it finds the collection, it returns all documents within in and we turn it into an array
// in itemsLeft, we are asking the server to access MongoDB and look for a collection named 'todos'. Once it finds the collection, it will count each document that has a property 'completed' with a value of false.
// lastly, we tell the server to render the data response as defined in our ejs file. We're asking it to return an object to hold the data we requested in the earlier variables.
app.get("/", async (req, res) => {
  const todoItems = await db.collection("todos").find().toArray();
  const itemsLeft = await db
    .collection("todos")
    .countDocuments({ completed: false });
  res.render("index.ejs", { zebra: todoItems, left: itemsLeft });
});

// when a POST request is made in the /createTodo route defined in our form (on our ejs file), we ask the server to carry the form information over to our 'todos' collection and insert that data into the collection under the property name 'todo'. We are also adding a new property 'completed' that will have a default value of false.
// once the POST request is added to the collection, a console log is made if the promise is fulfilled and we redirect the user to the root
app.post("/createTodo", (req, res) => {
  db.collection("todos")
    .insertOne({ todo: req.body.todoItem, completed: false })
    .then((result) => {
      console.log("Todo has been added!");
      res.redirect("/");
    });
});

// here we are asking the server to update info in our db collection 'todos' after an event listener with the function 'markComplete' is triggered on main.js. The request accesses the db 'todos' and finds the text that matches the click. Once it finds the matching document, it changes the value of the property 'completed' to true.
// the promise should then resolve with a console log and a response in json format
app.put("/markComplete", (req, res) => {
  db.collection("todos")
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: true
        }
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      res.json("Marked Complete");
    });
});

// this put request works just as the above put request, but instead will reset the property 'completed' value back to true
app.put("/undo", (req, res) => {
  db.collection("todos")
    .updateOne(
      { todo: req.body.rainbowUnicorn },
      {
        $set: {
          completed: false
        }
      }
    )
    .then((result) => {
      console.log("Marked Complete");
      res.json("Marked Complete");
    });
});

// this request is made when an event listener is triggered in main.js and performs the 'deleteTodo' function. The server will go into our 'todo' collection to find the item that matches our click event and remove it from our todo collection
// the promise should then resolve with a console log and a response in json format
app.delete("/deleteTodo", (req, res) => {
  db.collection("todos")
    .deleteOne({ todo: req.body.rainbowUnicorn })
    .then((result) => {
      console.log("Deleted Todo");
      res.json("Deleted It");
    })
    .catch((err) => console.log(err));
});

// this allows express to detect if there is a specified port from the host to run on. If no port is set there, it will use the port number we assigned in line 11. The console log gives us confirmation that the server is running and which port it's using
app.listen(process.env.PORT || PORT, () => {
  console.log("Server is running, you better catch it!");
});

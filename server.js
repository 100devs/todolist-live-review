// these are dependencies that are require to run modules.
const express = require("express"); // lets us access express
const app = express(); // I'm not sure but I know exxpress needs it to run.
const MongoClient = require("mongodb").MongoClient; // lets us acces our mongo client
const PORT = process.env.PORT || 3000; // our port to connect to, the process.env is for hosting site to run on their port.
require("dotenv").config();

// MONGO DB INFORMATION
// This variable is to access the database string and the database name.
let db,
  dbConnectionStr = process.env.DB_STRING, // stored in our env file.
  dbName = "todo-app";

// this is to connect to your database. Topology is used to avoid an error at the beginning.
MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
  .then((client) => {
    // this is to check that we are connected to the database.
    console.log(`Connected to ${dbName} Database`);
    // this is the connection name to the database.
    db = client.db(dbName);
  })
  // catch err helps us find any error in our code, without it, it makes it hard to see why our code is not working.
  .catch((err) => {
    console.log(`error ${err}`);
  });

// MIDDLEWARE are functions that allow us to access function calls such as our files.
app.set("view engine", "ejs"); // the code allows us to read our ejs file.
app.use(express.static("public")); // tells the server to access our html/css/js files
app.use(express.urlencoded({ extended: true })); // I have no idea. I read it up on google but I'm confused.
app.use(express.json()); // parses incoming requests.

// GET REQUEST
// asking for request when user enters the website
app.get("/", (req, res) => {
  // addTodo comes from the form on EJS
  db.collection("todo-app")
    .find() // finds teh collection
    .toArray() // turns the collection into an array.
    .then((data) => {
      console.log(data); // checks our data in the databse
      res.render("index.ejs", { addTodo: data }); // renders our ejs file for database
    })
    // lets us know our error if we run into one.
    .catch((err) => {
      console.log(err);
    });
});

// POST REQUEST
// this is what the user is trying to add to our database
app.post("/addTodo", (req, res) => {
  // POST INFO TO THE DATABASE --- todoName comes from the input form on EJS.
  db.collection("todo-app") // name of our database on mongodb
    .insertOne({ todoName: req.body.todoName.toUpperCase() }) // reads the name from ejs and stores into our database
    .then((result) => {
      res.redirect("/"); // when user submit it will redirect to the homepage
    });
  console.log(req.body); // lets us know whats being read when user sends a request
  console.log(req.body.todoName); // lets us know the name of the request went through
});

// PUT REQUEST
// allows users to cross off their todo item
app.put("/markComplete", (req, res) => {
  db.collection("todo-app")
    .updateOne(
      { todoName: req.body.todoName }, // reads our ejs file documents on mongodb
      {
        $set: {
          // no idea
          completed: true, // no idea
        },
      },
      {
        sort: { _id: -1 }, // no idea
        upsert: false, // no idea
      }
    )
    .then((result) => {
      console.log("Completed"); // checks if  user successfully completed todo item
      res.json("completed"); //sends our mongodb information to show we have completed information from user
    })
    .catch((error) => console.log(error)); // catch error when something goes wrong.
});

// DELETE REQUEST
// allows user to delete an item
app.delete("/deleteTodo", (req, res) => {
  db.collection("todo-app")
    .deleteOne({ todoName: req.body.todoName }) // access to our todo database on mongodb
    .then((result) => {
      console.log("todo deleted"); // make sure the item got deleted
      res.json("todo deleted"); // sends deleted item to mongodb
    })
    .catch((error) => console.error(error)); // catch our erros
});

// PORT SETUP
// allows us to see if the port is up and running
app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`); // tells us if the server is running.
});

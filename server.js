
//setting up our variables to use express. I think these are handlers... 

const express = require("express")
const app = express()
//connecting to our database
const MongoClient = require("mongodb").MongoClient 
//setting up port on localhost
const PORT = 3000

//still a little confused on dotenv, but this is setting up our environment of secrets
require("dotenv").config()

//variables set up to connect with our database, using only 1 let keyword and separated by comma
let db,
//our secret place for our secret connection string
    dbConnectionStr = process.env.DB_STRING, 
    dbName = "to-do-list"

    //connecting to databse
MongoClient.connect(dbConnectionStr, 
 //some line of code, don't know what it does, but, it stops errors with our MongoDB 
{useUnifiedTopology: true})
.then(client => {
 //log to show we're connect to db
 console.log("Connected to Database")
 //not sure about the syntax of the line below
 db = client.db(dbName)

 //below is our middleware? 

 //connecting to our ejs 
 app.set("view engine", "ejs")
 //Leon's fav line of code, don't need a specific route and JS knows where to go to find our client-side code with no problems
 app.use(express.static("public"))
 //2 lines below get responses from client form and are used instead of bodyparsers. Not sure how they function exactly. 
 app.use(express.urlencoded({extended: true}))
 app.use(express.json()) 


//get request. 
app.get("/", async (req, res) => { 
 //getting items to do from our database and putting them into an array
 const todoItems = await db.collection("todo").find().toArray()
 //counting the items we have left to do that have the property of completed false 
 const itemsLeft = await db.collection("todo").countDocuments({completed: false})
 //passing those items into our ejs to be rendered. But I'm confused on the syntax 
 res.render("index.ejs", {zebra: todoItems, left: itemsLeft})
})

//our post request - we are taking the input from our form in the client side, and adding it to our db. /todo comes from the action in our ejs
app.post("/todo", (req, res) => {
 //adding to our todo collection name, adding one new document, and giving it the property of completed false 
 db.collection("todo").insertOne({todo: req.body.todoItem, completed: false})
 // redirecting back to our homepage after added to the db. 
 .then(result => { 
  res.redirect("/")
 })
.catch(error => console.error(error))
}) 

//we are updating with our put request. The markComplete route comes from our main.js
app.put("/markComplete", (req, res) => {
 //going to our mongo collection and changing one document that matches the requirements. 
 //not sure how we related to rainbowUnicorn
 db.collection("todo").updateOne({todo :req.body.rainbowUnicorn},{
  //$set is a property that comes from mongoDB, once we find the above match, we set it to true. Again, not sure of the $ syntax 
  $set: {
   completed: true
  }
 })
 //handling our promise, 
 .then(result => {
  console.log("Marked Complete")
  //confused on res.json in this case 
  res.json("Marked Complete")
 })
 .catch(err => console.log(error))
}) 

//here we are updating the linethrough, same as above. Undo function comes from our main.js 
app.put("/undo", (req, res) => {
//problems with syntax below
 db.collection("todo").updateOne({todo :req.body.rainbowUnicorn},{
  $set: {
   completed: false
  }
 })
 .then(result => {
  console.log("Marked Complete")
  //problems with understanding this json againr
  res.json("Marked Complete")
 })
})

//this part is just setting up our server. process.env.PORT is needed for heroku. Not sure what these words mean individually tho 
app.listen(process.env.PORT || PORT, ()=>{
 console.log("listening on 3000")
})

//finally, this is our deleting request, /deleteTodo comes from our main.js 
app.delete("/deleteTodo", (req, res) =>{
 //go to our collection, and delete one item that fits the requirements, confused on syntax
 db.collection("todo").deleteOne({todo: req.body.rainbowUnicorn})
 //handling our promise
 .then(results => {
  console.log("Deleted Todo")
  //confused on json and where "deleted it" goes
  res.json("Deleted It")
 })
 .catch( err => console.log(err))
})

})
.catch(error => console.error(error))


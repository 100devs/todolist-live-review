const express = require('express')// telling the program we require express 
const app = express() // changing express to = app so it's cleaner code 
const MongoClient = require ('mongodb').MongoClient //we need this to connect to MongoDB
const PORT = 1000 //this is rhe port connection we are running on 
require('dotenv').config()


let db,  //our varible names 
    dbConnectionStr = process.env.DB_STRING,  //the link from our database on MongoDB 
    dbName = 'todo' //what we named our database 


MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //need this to connect to Mongo but not sure what it is doing or why we need it 
    .then(client => { //what is being returned?  But I am not sure 
        console.log(`You are connected to ${dbName} database`) //debuggging 
        db = client.db(dbName) //not sure 
    })
    .catch(err => {
        console.log(err) //to see what the actual errors might be - if there are any - debugger 
    })

//middleware 
app.set('view engine', 'ejs') // sets up the ejs file 
app.use(express.static('public')) // can serve up all static files 
app.use(express.urlencoded({ extended:true})) // this will allow us to pull the info out of the form 
app.use(express.json()) //this will allow us to pull the info out of the form


app.get('/', async (req, res) => {  //our main route get  -- req and res are the callbacks 
    const todoItems = await db.collection('todos').find().toArray() //new way of doing things.  Looks pretty but I am not sure how it works
    const itemsLeft = await db.collection('todos').countDocuments( //new way of doing things.  Looks pretty but I am not sure how it works
    {completed: false}) //new way of doing things.  Looks pretty but I am not sure how it works
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //new way of doing things.  Looks pretty but I am not sure how it works

    //hot garage -- turning into callback hell
    // db.collection('todos').find().toArray() //going to find all the objects in our collection using an array //turns our objects into an array 
    // .then(data => { //"data is the array we got back from the data base"
    //     res.render('index.ejs', {zebra: data, left: itemsLeft})  //handling what happens - in this case it is "rendering" -- responding 
    // })

})


app.post('/createTodo', (req, res ) => { // route to target page 
    console.log(req.body.todoItem) //targets the exact items you want
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //allows us to insert items into the document  //items are default to false becasue they haven't been compleetd 
        .then(result => {
            console.log('To do has been added!') //debugging 
            res.redirect('/')  //data is redirecting back to the main route 
        }) 
})


app.put('/markComplete',(req, res) => { //our route to markCompleted
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //I am not sure 
        $set: {
            completed: true  //changes the status in mongo from false to true
        }
    }) 
    .then(result => {
        console.log('Marked Complete') //debugging 
        res.json('Marked Complete') //the return from our database 
    })
})


app.put('/undoComplete', (req, res)=>{ //the route to undo the completes 
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //key word "updateOne allows us  to update items in our code"
        $set: { 
            completed: false //changes the status in mongo from true to false 
        }
    })
    .then(result =>{
        console.log('Marked Complete')  //debugging 
        res.json('Marked Complete') //the return from our database 
    })
})

app.delete('/deleteTodo', (req, res) => { //our route to the deleted part 
    console.log(req.body.rainbowUnicorn) //debugging 
    db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn}) //I am not sure.  I know it has something to do with the database 
        .then(result => { //this is what we want to happen after the items have been completed??  -- not really sure
            console.log('Deleted To do item')  //checks to make sure things work
            res.json('Deleted it') //the response from JSON 
        })
      .catch( err => console.log(err))  //look for errors 
})


app.listen(process.env.PORT || PORT, () => { // our port aka the line we are running our server on 
    console.log('Server is runnnnnnnning.  You better catch it') //logging our server to make sure we are connecting - aka a debugger
})


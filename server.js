//we set an express variable to require express
const express = require('express')
//ser an app variable that uses the express functionalities
const app = express()
//set a mongo variable that utilizes mondo db functionality
const MongoClient = require('mongodb').MongoClient
//set a port variable with out chosen port number
const PORT = 2121
//this allows us to use the dotenv functionality, which keeps important items private, make sure to put env file in git ignore so it does not get pushed to github
require('dotenv').config()

// create a variable that stores a path to link to our database
//I DONT KNOW  why we use a comma after db
let db,
    //db string is our url for the database. this is hidden in our dot env
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'todo'


MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        console.log(`Hey, connected to ${dbName} database`)
        db = client.db(dbName)
    })
    .catch(err => {
        console.log(err)
    })

// ALLOWS us to use EJS
app.set('view engine', 'ejs')
//I DONT KNOW
app.use(express.static('public'))
//I DONT KNOW
app.use(express.urlencoded({ extended: true }))
//I DONT KNOW -- im assuming since we required express above we need to use it -- I dont knwo whaat .json() does
app.use(express.json())

//get request, it is made every time the page is refreshed or when it is first loaded
app.get('/', async (req, res) => {
    // todoItems stores items from the collection todos in an array using the find and toarray methods
    const todoItems = await db.collection('todos').find().toArray()
    // items left uses the countdocuments method from mongoclient to count how many objects match the completed false, thus giving us a total number of tasks that have yet to be completed
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false })
    //with the render method, we can target our EJS folder and match areas of zebra and left, in which we will present the contents of the database
    res.render('index.ejs', { zebra: todoItems, left: itemsLeft })
})

//post allows us to a a task to the todo list, the createTodo route matches the action in the form within EJS
app.post('/createTodo', (req, res) => {
    //we access out data base and use the insertOne method to insert a new task
    //new task is grabbed from the form in the EJS with the name todoItem and put into an object called todo -- additionally we set the class of completed to false, thereby keeping certain css styles from being applies
    db.collection('todos').insertOne({ todo: req.body.todoItem, completed: false })
        .then(result => {
            console.log('Todo has been added!')
            res.redirect('/')
        })
})

app.put('/markComplete', (req, res) => {
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
        //we set the class of completed to true 
        $set: {
            completed: true
        }
    })
        .then(result => {
            console.log('Marked Complete')
            //IDONT KNOW
            res.json('Marked Complete')
        })
})

//put has the undo route which matches the fetch made in the main.js
app.put('/undo', (req, res) => {
      //we go into our data base looking for the todos collection, wherein we assign the content of the body named rainbowUnicorn to 'todo" and use the method updateOne to update it it
    db.collection('todos').updateOne({ todo: req.body.rainbowUnicorn }, {
        //we set the class of completed to false, thereby applying the corresponding css
        $set: {
            completed: false
        }
    })
        .then(result => {
            console.log('Marked Complete')
            //I DONT KNOW
            res.json('Marked Complete')
        })
})

//detele method has the deleteTodo route matching the fetch made in main js 
app.delete('/deleteTodo', (req, res) => {
    //we go into our data base looking for the todo collection, wherein we assign the content of the body named rainbowUnicorn to 'todo" and use the method deleteOne to delete it
    db.collection('todos').deleteOne({ todo: req.body.rainbowUnicorn })
        // we then log to the console
        .then(result => {
            console.log('Deleted Todo')
            //I DONT KNOW
            res.json('Deleted It')
        })
        .catch(err => console.log(err))
})

// app.listen method "listens" to what port we are running our server on. The conditional logic lets heroku decide if they want to use their own PORT
app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running, you better catch it!')
})
const express = require('express') // grabbing express module that we downloaded using 'npm install express' and storing it in a variable
const app = express() // storing the express 'method' or 'function' in a variable named app
const MongoClient = require('mongodb').MongoClient // grabbing MongoCient (property) from the 'mongodb' module that we installed using 'npm install mongodb' and storing it in a variable named MongoClient
const PORT = 2121 // declaring a port and storing it in a variable named PORT. Port will default to 3000 if we don't declare one
require('dotenv').config() // installed using 'npm install dotenv'. Using this will hide our sensitive information i.e. usernames, passwords 

let db, // declaring a varible named 'db' to store the name of our database located on mongodb (see line 14)
    dbConnectionStr = process.env.DB_STRING, //storing our secret link to mongodb database in a variable (see line 5)
    dbName = 'todo' // Naming our database. this same name with appear in the cluster when we log into mongodb Atlas

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true}) //This connects us to our database. the first arg is our secret link (see line 8). ** the second arg is to prevent a deprecation warning? **
    .then(client => { // our response with give us back our client(data) if we don't get errors
        console.log(`Hey, connected to ${dbName} database`) // will see this in terminal 'Hey, connected to todo(see line 9) database'
        db = client.db(dbName) // storing our database info in db to use elsewhere in this file (see lines 26 and 27)
    })
    .catch(err =>{ //if something happens where we can't connect to our database, then we will console the error
        console.log(err) // console logging the error
    })

app.set('view engine', 'ejs') // setting up express to read our ejs file
app.use(express.static('public')) // ** setting up express to read files located in the public's folder without using the common script tag at the bottom of the file **
app.use(express.urlencoded({ extended: true })) // ** not sure what this does **
app.use(express.json()) // ** let's express read/use json files **

app.get('/', async (req,res)=>{ // CREATE of Crud. first arg is our endpoint, which will be whatever line 28 renders. second arg is our promise - request and response
    const todoItems = await db.collection('todos').find().toArray() // goes into our database and looks at our collection named 'todos'. Finds all of the documents (.find()) and turns them into an array(.toArray())
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) // goes into our database and looks at our collection named 'todos'. Adds up (.countDocuments) all the documents that have the key value piar of 'completed: false'
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) // the response, taking the method of render(the render method is taken from the express module) has 2 args. first arg is the endpoint, our index.ejs file located in views. the second arg is the info we want to get from our index.ejs 
})

app.post('/createTodo', (req, res)=>{ // READ of cRud. first arg is our endpoint, which points the form we created in our index.ejs file (line 27 in index.ejs). second arg is our promise - request and reponse
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) // We're creating a new document to live on our database. this document will contain 2 objects: (1)todo: name of task(req.body.todoItem) (2)completed: false
    .then(result =>{ // if successful, the following should happen:
        console.log('Todo has been added!') // 'Todo has been added!' should appear in our terminal after we 'click'
        res.redirect('/') // ** redirects us back to the index.ejs file **
    })
})

app.put('/markComplete', (req, res)=>{ // UPDATE of crUd. first arg is our endpoint, which points to the promise located in our main.js file. this endpoint has to be named exactly like our promise (see line 38 in main.js). second arg is our promise - request and response
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // We are updating a specific document located in our database that has a key of 'todo' and the value of whatever is stored in 'req.body.rainbowUnicorn' (see line 42 in main.js)
        $set: { // ** a method taken from express that allows us to update a condition on an existing document key **
            completed: true // we are changing the value of completed to true from false
        }
    })
    .then(result =>{ // If successful, we should see the following:
        console.log('Marked Complete') // 'Marked Complete' should appear in our terminal
        res.json('Marked Complete') // ** not sure what it does, but is needed in order to fulfill promise on line 27 in main.js **
    })
})

app.put('/undo', (req, res)=>{ // UPDATE of crUd. first arg is our endpoint, which points to the promise located in our main.js file. this endpoint has to be named exactly like our promise (see line 56 in main.js). second arg is our promise - request and response
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ // We are updating a specific document located in our databse that has a key of 'todo' and the value of whatever is stored in 'req.body.rainbowUnicorn' (see line 60 in main.js)
        $set: { // ** a method taken from express that allows us to update a condition on an existing document key **
            completed: false // we are changing the value of completed to false from true
        }
    })
    .then(result =>{// If successful, we should see the following:
        console.log('Marked Complete') // 'Marked Complete' should appear in our terminal
        res.json('Marked Complete') // ** not sure what it does, but is needed in order to fulfill promise on line 27 in main.js **
    })
})

app.delete('/deleteTodo', (req, res)=>{ // DELETE of cruD. first arg is our endpoint, which points to the promise located in our main.js file. this endpoint has to be named exactly like our promise ( see line 20 in main.js )
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) // We are deleting a specific document located in our database that has a key of 'todo' and the value of whatever is stored in 'req.body.rainbowUnicorn' (see line 24 in main.js)
    .then(result =>{ // If successful, we should see the following:
        console.log('Deleted Todo') // 'Deleted Todo' should appear in our terminal
        res.json('Deleted It') // ** not sure what it does, but is needed in order to fulfill promise on line 27 in main.js **
    })
    .catch( err => console.log(err)) // If we made a mistake somewhere, we will be notified in the terminal
})
 
app.listen(process.env.PORT || PORT, ()=>{ // this is how express connects to our local device. the first arg will be the port number (see line 4) and the second arg is a callback and will console log a message if we made a successful connection.
    console.log('Server is running, you better catch it!')
})    
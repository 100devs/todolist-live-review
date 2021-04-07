const express = require('express')  //this tells node we are going to be using express
const app = express() //this sets the express funcionality to the variable app
const MongoClient = require('mongodb').MongoClient //this tells node we will be using mongodb package
const PORT = 2121 //this is the port that the server will be listening on for the requests
require('dotenv').config() //this tells node we will be using the dotenv package

let db,  //here we are declaring a group of variables starting with db which will represent our database link
    dbConnectionStr = process.env.DB_STRING,  //this variable contains the string that leads to our database on mongo atlas; it is being referenced from the .env file to keep it secret
    dbName = 'todo' //this is the name of the database that we will be using to store and pull data from

MongoClient.connect(dbConnectionStr, {useUnifiedTopology: true})  //creating a connection to the mongo db using the connection string using the magin property and value pair to avoid errors (have looked up unifiedtopo...)
    .then(client => {  //this catches the promise made in the previous line and sets the returned data to the variable client
        console.log(`Hey, connected to ${dbName} database`) //verifying that the connection to the db is working
        db = client.db(dbName)  //sets the db variable to the returned succesful connection to the database
    })
    .catch(err =>{ //catches any errors that might occur and sets the error message to the err variable
        console.log(err) //console logs the error message to the server
    })

app.set('view engine', 'ejs') //tells express that we will be using the ejs pack to process the files in the view folder
app.use(express.static('public')) //tells express to handle delivering the files place in the public folder
app.use(express.urlencoded({ extended: true })) //tells express to use urlencode option to parse url encoded bodies of any type
app.use(express.json()) //it tells express to parse request with json for us

app.get('/', async (req,res)=>{ //it stats a get route or read route to the default page/index it sets it as an async function that recieves request and response in the req and res variables
    const todoItems = await db.collection('todos').find().toArray()  //set an unchangable variable to recieve and wait for the data of a promise to get every item from the todos collection of our database that will be returned as an array.
    const itemsLeft = await db.collection('todos').countDocuments({completed: false}) //set an unchangable variable to recieve and wait for the number of documents in the todos collection that has the completed property set to false
    res.render('index.ejs', {zebra: todoItems, left: itemsLeft}) //sends a reponse to render the index.ejs file with the data from zebra which is set to the todoitems variable and left which is set to the itemsleft
})

app.post('/createTodo', (req, res)=>{  //recieves a post request from the client to create a todo through the createTodo route/page 
    db.collection('todos').insertOne({todo: req.body.todoItem, completed: false}) //tells the database to insert one data object into our database collection, the object set the db property todo to the data recieved called todoItem and sets completed to be false automaticly.
    .then(result =>{ //recieves the successful result of the db promise and set any response data to results
        console.log('Todo has been added!') //log that the object was place in db
        res.redirect('/') //tells the client to refresh the page
    })
})

app.put('/markComplete', (req, res)=>{ //recieves a request through the markComplete route from the client to edit a data from the db
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //tells the db to update a document from our collection, we send an object to identify which document to edit. in this case we tell it to find the document where todo is set to rainbowunicorn varaible recieved by the client.
        $set: { //change the selected document
            completed: true //modify the completed property of the selected document to true.
        }
    })
    .then(result =>{ //recieves the successful result of the db promise and set any response data to results
        console.log('Marked Complete') //log that the document was editted successfully
        res.json('Marked Complete') //sends the client a response that the edit was successfully
    })
})

app.put('/undo', (req, res)=>{ //recieves a request through the undo route from the client to edit a data from the db
    db.collection('todos').updateOne({todo: req.body.rainbowUnicorn},{ //tells the db to update a document from our collection, we send an object to identify which document to edit. in this case we tell it to find the document where todo is set to rainbowunicorn varaible recieved by the client.
        $set: { //change the selected document or set it
            completed: false //modify the completed property of the selected document to false.
        }
    })
    .then(result =>{ //recieves the successful result of the db promise and set any response data to results
        console.log('Marked Complete')  //log that the document was editted successfully
        res.json('Marked Complete') //sends the client a response that the edit was successfully
    })
})

app.delete('/deleteTodo', (req, res)=>{  //recieves a request through the deleteTodo route from the client to delete data from the db
    db.collection('todos').deleteOne({todo:req.body.rainbowUnicorn}) //tells the database to delete the document that has its todo property set to the rainbowunicorn value sent by the client
    .then(result =>{ //recieves the successful result of the db promise and set any response data to results
        console.log('Deleted Todo')  //log that the document was deleted successfully
        res.json('Deleted It') //sends the client a response that the delete was successfully
    })
    .catch( err => console.log(err)) //catches any errors that might occur and sets the error message to the err variable and logs it
})
 
app.listen(process.env.PORT || PORT, ()=>{  //set the server to listen for request on the port set by the .env file or the port variable if the env file/variable is not there
    console.log('Server is running, you better catch it!') //if connection is successfully the it log this message lol
})    
/*
This code sets up a Node.js server using Express. 
It defines routes for user authentication and registration. 
It includes functionality for signing in, registering new users, fetching user profiles, and updating user entries. 
The code interacts with a mock database to store user information securely, using bcrypt for password hashing and comparison.
*/
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors'); //cross origin resource sharing (secure communication between server and client)
const app = express();
// use bodyparser to call app
app.use(cors());
app.use(bodyParser.json());

// mock database for storing users information
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            // store passwords in hashes for security reasons
            password: 'cookies',
            // track number of times john submits photo requests
            entries: 0,
            // timestamp of last photo request
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@example.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com',
        }
    ]
}
// root route: just gets users
app.get('/', (req,res) => {
    res.send(database.users);
})

// signin route: compares user input to string stored in database (string is hashed for security purposes)
// server checks if user exists, then gives a response
app.post('/signin', (req,res) => {
    bcrypt.compare("apples", '$2a$10$SUqTV.TckJKPrblX/a1jOOnSfOLyBW./BTJz7w3CJaFpvqOsIb46S', function(err, res) {
        console.log('first guess', res)
    });
    bcrypt.compare("veggies", '$2a$10$SUqTV.TckJKPrblX/a1jOOnSfOLyBW./BTJz7w3CJaFpvqOsIb46S', function(err, res) {
        console.log('second guess', res)
    });

    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
        // return real user from mock database
        res.json(database.users[0]);
    }
    else
    {
        res.status(400).json('error logging in');
    }
})
// register route: creates new user in database (hashed for security)
app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    let lastUserId;
    // check for existing users in database
    if (database.users.length > 0) {
        // set lastUserId to last index of the database
        lastUserId = database.users[database.users.length - 1].id;
    } else {
        lastUserId = 0;
    }
    // generate new user id for user registered in system
    // get ID of last user, increment by 1, convert string to new user id
    let newUserId = (parseInt(lastUserId) + 1).toString();
    // add new user to database in json format (localhost:3001)
    database.users.push({
        id: newUserId,
        name: name,
        email: email,
        // everytime user submits image, increase entries count
        entries: 0,
        joined: new Date()      
    })
    // always make sure to respond (res.) with express or it won't render
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req,res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id)
        {
            found = true
            user.entries++;
            return res.json(user);
        }
    })
    if (!found)
    {
        res.status(400).json('no such user');
    }
})

// express has built-in json() functions
app.put('/image', (req,res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id)
        {
            // if user found, increase entries
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
// if user NOT found, print 400 error
    if (!found)
    {
        res.status(400).json('no such user');
    }
})
// bcrypt.hash("bacon", null, null, function(err, hash) {
// // store hash in your password db
// });

// // load hash from password DB
// bcrypt.compare("veggies", hash, function(err, res) {

// });
app.listen(3001, ()=> {
    console.log('listening on port 3001');
})

/*
// ROADMAP
/res --> this is working
/signin --> POST: success/fail
/register --> POST: user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors'); //cross origin resource sharing (secure communication between server and client)
const app = express();
// use bodyparser to call app
app.use(cors());
app.use(bodyParser.json());

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
    // res.send('this is working');
    res.send(database.users);
})

// signin route: compares user input to string stored in database (hashed for security purposes)
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
        res.json('success');
    }
    else
    {
        res.status(400).json('error logging in');
    }
})

// register route: creates new user in database (hashed for security)
app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        // everytime user submits image, increase entries count
        entries: 0,
        joined: new Date()      
    })
    // always make sure to respond with express or it won't render
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
app.post('/image', (req,res) => {
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
// if user NOT found, print 404 error
    if (!found)
    {
        res.status(404).json('no such user');
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
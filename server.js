const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const app = express();
// use bodyparser to call app
app.use(bodyParser.json());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
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
app.get('/', (req,res) => {
    // res.send('this is working');
    res.send(database.users);
})

app.post('/signin', (req,res) => {
    bcrypt.compare("bacon", hash, function(err, res) {
        
    })
if (req.body.email === database.users[0].email && 
    req.body.password === database.users[0].password) {
    res.json('success');
}
else
{
    res.status(400).json('error logging in');
}
})

app.post('/register', (req,res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        // store hash in password db
        console.log(hash);
    });
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

bcrypt.hash("bacon", null, null, function(err, hash) {
    // Store hash in your password DB.
});

// Load hash from your password DB.
bcrypt.hash("bacon", null, null, function(err, hash) {
    bcrypt.compare("bacon", hash, function(err, res) {
        console.log(hash);
        // res == true
    });
});
bcrypt.hash("veggies", null, null, function(err, hash) {
    bcrypt.compare("veggies", hash, function(err, res) {
        console.log(hash);
        // res = false
    });
});
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
app.listen(3001, ()=> {
    console.log('listening on port 3001');
})

/*
/res --> this is working
/signin --> POST: success/fail
/register --> POST: user
/profile/:userId --> GET = user
/image --> PUT --> user
*/
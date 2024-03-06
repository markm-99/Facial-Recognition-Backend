const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const app = express();
// reference database for parameters (id, name, password)
const database = {
    users: [
        // remove password, use bcrypt to hash it
        {
            id: '123',
            name: 'John',
            email: 'john@example.com',
            password: 'cookies',
            entries: 0,
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
            email: 'john@example.com',
        }
    ]
}

// .use(): used for middleware, declare before using
// cors(): middleware
app.use(cors());
app.use(bodyParser.json());

// root route
app.get('/', (req, res) => {
    res.send(database.users);
    res.send('this is working');
})

// res = this is working
// /signin route --> POST --> success/fail 
app.post('/signin', (req, res) => {
    bcrypt.compare("apples", '$2a$10$PKO/mTprQQZFSFGpNz2eFuedW.5yPooF3ez0ZWYfcEeT5.yqGRote', function(err, res){
        console.log('first guess', res)
    });
    
    bcrypt.compare("veggies", '$2a$10$PKO/mTprQQZFSFGpNz2eFuedW.5yPooF3ez0ZWYfcEeT5.yqGRote', function(err, res){
        console.log('second guess', res)
    });

    if (req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password)
        {
            res.json('success');
        }
        else
        {
            res.status(400).json('error logging in');
        }
    })

// prevent read property of undefined
// need to parse data from the frontend using body-parser
app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash("bacon", null, null, function(err, hash) {
        console.log(hash);
    });
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    })
    res.json(database.users[database.users.length-1]);
})

// always remember to add response
// profile route
app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    let found = false;
    // loop thru sample database and find matching id, if match, return the corresponding user
    database.users.forEach(user => {
        // if database user id = id from params
        if (user.id === id) {
            found = true;
            return res.json(user);
            
            found = true;
            user.entries++;
            return res.json(user);
        }
    })
    if (!found) {
        res.status(400).json('not found');
    }
})

app.post('/image', (req, res) => {
    // to update entries, need id of user
    const { id } = req.body;
    let found = false;
    // loop thru sample database and find matching id, if match, return the corresponding user
    // if user found, increase user entry
    database.users.forEach(user => {
        // if user id exists, increment the entry count 
        if (user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })

    // if user not found, return error message
    if (!found) {
        res.status(400).json('not found');
    }
})


app.listen(3001, ()=> {
    console.log('app is running on port 3001');
    })
    // /register route --> POST --> user 
    // /profile/:userId --> GET = user 
    // /image --> PUT --> user variable to keep count/score
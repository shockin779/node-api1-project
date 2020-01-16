// implement your API here
const express = require('express');
const db = require('./data/db.js');

const server = express();

server.listen(4000, () => {
    console.log('***listening on port 4000');
})

server.use(express.json());


//-----------------------------------------------------------------------------------------------------------
// Get all users from db
//-----------------------------------------------------------------------------------------------------------
server.get('/api/users', (req, res) => {
    db.find()
        .then(users => {
            res.status(200).json({users});
        })
        .catch(err => {
            res.status(500).json({errorMessage: "The users information could not be retieved."});
        })
});

//-----------------------------------------------------------------------------------------------------------
// Get specific user from db
//-----------------------------------------------------------------------------------------------------------
server.get('/api/users/:id', (req, res) => {
    const {id} = req.params;
    db.findById(id)
        .then(user => {
            if(user) {
                res.status(200).json({user})
            } else {
                res.status(404).json({ message: "The user with the specified ID does not exist."});
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: "The user information could not be retrieved."})
        })
})

//-----------------------------------------------------------------------------------------------------------
// Create a user into the db
//-----------------------------------------------------------------------------------------------------------
server.post('/api/users', (req, res) => {
    const user = req.body;

    if(!user.name || !user.bio) {
        res.status(400).json({errorMessage: "Please provide name and bio for the user."});
    } else {
        db.insert(user)
            .then(created => {
                if(created) {
                    res.status(201).json(created);
                } else {
                    res.status(500).json({ errorMessage: "There was an error while saving the user to the database."});
                }
            })
            .catch(err => {
                res.status(500).json({errorMessage: "There was a server error"});
            })
    }
})

//-----------------------------------------------------------------------------------------------------------
// Delete a user from the db
//-----------------------------------------------------------------------------------------------------------
server.delete('/api/users/:id', (req, res) => {
    const {id} = req.params;

    db.remove(id)
        .then(deleted => {
            if(deleted) {
                res.status(204).json({deleted});
            } else {
                res.status(500).json({errorMessage: "The user could not be removed."});
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: "There was a server error"});
        })
})

//-----------------------------------------------------------------------------------------------------------
// Modify a user in the db
//-----------------------------------------------------------------------------------------------------------
server.put('/api/users/:id', (req, res) => {
    const {id} = req.params;
    const changes = req.body;

    db.update(id, changes)
        .then(updated => {
            if(updated) {
                res.status(200).json({updated});
            } else {
                res.status(404).json({errorMessage: "The user with the specified ID does not exist."})
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: "There was a server error"});
        })
})
const express = require('express');
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.use("/:id", validateUserId); 

router.post('/', validateUser, (req, res) => {
    userDB.insert(req.body)
        .then(response => {
            res.status(200).json({ response });
        })
        .catch(error => {
            res.status(500).json({ message: "Could not post new user." });
        })
});

router.post('/:id/posts', validatePost, (req, res) => {
    postDB.insert({...req.body, ["user_id"]: req.params.id })
        .then(response => {
            res.status(200).json({ response });
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to post new post." });
        })
});

router.get('/', (req, res) => {
    userDB.get()
        .then(response => {
            res.status(200).json({ response })
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to retrieve users." });
        })
});

router.get('/:id', (req, res) => {
    userDB.getById(req.params.id)
        .then(response => {
            res.status(200).json({ response });
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to retrive user." })
        })
});

router.get('/:id/posts', (req, res) => {
    userDB.getUserPosts(req.params.id)
        .then(response => {
            res.status(200).json({ response });
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "Unable to retrieve user posts." });
        })
});

router.delete('/:id', (req, res) => {
    userDB.remove(req.params.id)
        .then(response => {
            res.status(200).json({ message: `${response} user was deleted from database.` });
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "Can't remove user." });
        });
});

router.put('/:id', (req, res) => {
    userDB.update(req.params.id, req.body)
        .then(response => {
            res.status(200).json({ message: `${response} user was updated.` });
        })
        .catch(error => {
            res.status(500).json({ errorMessage: "Can't update user." });
        })
});

//custom middleware

function validateUserId(req, res, next) {
    userDB.getById(req.params.id)
        .then(response => {
            if ( response ) {
                req.user = response;
                next();
            } else {
                res.status(404).json({ message: "Invalid user id." })
            }
        })
        .catch(error => {
            res.status(500).json({ message: "Unable to connect to database." });
        });
}

function validateUser(req, res, next) {
    if( Object.keys(req.body).length !== 0 ) {
        req.body.name ?
            next()
            : res.status(400).json({ message: "Missing name field." })
    } else {
        res.status(400).json({ message: "Missing user data." });
    }
}

function validatePost(req, res, next) {
  if( Object.keys(req.body).length !== 0 ) {
      req.body.text ?
          next()
          : res.status(400).json({ message: "Missing text field." })
  } else {
      res.status(400).json({ message: "Missing user data." });
  }
}

module.exports = router;

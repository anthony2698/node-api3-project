const express = require('express');
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.use("/:id", validateUserId); 

router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
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
    if ( !req.body ) {
        res.status(400).json({ message: "Missing user data." });
    } else if ( !req.body.name ) {
        res.status(400).json({ message: "Missing required name field." });
    } else {
        next();
    }
}

function validatePost(req, res, next) {
  if ( !req.body ) {
      res.status(400).json({ message: "Missing user data." });
  } else if ( !req.body.text ) {
      res.status(400).json({ message: "Missing required name text." });
  } else {
    next();
  } 
}

module.exports = router;

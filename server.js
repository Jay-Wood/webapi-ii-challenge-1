const express = require("express");
const db = require("./data/db.js");
const server = express();

server.use(express.json());

server.post("/api/posts", (req, res) => {
    const post = req.body;

    db.insert(post)
        .then( () => {
            if(!post.title || !post.contents) {
                res.status(400).json({ errorMessage: "Please provide title and contents for the post."})
            } else {
                res.status(201).json(post)
            }})
        .catch( () => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
})

server.get("/api/posts", (req, res) => {
    db.find()
        .then( posts => res.status(201).json(posts))
        .catch( () => {
            res.status(500).json({ error: "The posts information could not be retrieved." })
        })
})

server.get("/api/posts/:id", (req, res) => {
    const id = req.params.id;
    db.findById(id)
        .then( 
            post => {
                if(post.length === 0) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                } else {
                    res.status(201).json(post)
                }
            }
        )
        .catch( () => {
            res.status(500).json({ error: "The post information could not be retrieved." })
        })
})

server.delete("/api/posts/:id", (req, res) => {
    const id = req.params.id;

    db.remove(id)
        .then(
            post => {
                if(post.length === 0) {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                } else {
                    res.status(201).json(post)
                }
            }
        )
        .catch( () => {
            res.status(500).json({error: "The post could not be removed"})
        })
})

server.post("/api/posts/:id/comments", (req, res) => {
    const id = req.params.id;
    const comment = req.body;
    console.log("REQ.BODY: ", comment)

    db.findById(id)
        .then( post => {
            if(post.length === 0) {
                res.status(404).json({ message: "The post with the specified ID does not exist." })     
            } else if(!comment.text) {
                res.status(400).json( {errorMessage: "Please provide text for the comment."} )
            } else {
                db.insertComment(comment).then(comm => {
                    res.status(201).json(comm)
                })
            }
        })
        .catch( () => {
            res.status(500).json({error: "There was an error while saving the comment to the database"})
        })
})



// server.get("/api/users", (req, res) => {
//     db.find()
//         .then(users => res.status(200).json(users)) 
// });

// server.get("/api/users/:id", (req, res) => {
//     const id = req.params.id;
//     db.findById(id)
//         .then(user => res.status(200).json(user))
// })

module.exports = server;
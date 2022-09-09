const Post = require("../models/postModels");
// const User = require('../models/userModels');

const fs = require("fs");

// Récupration de touts les posts ...............................................
exports.getAllPosts = (req, res, next) => {
  Post.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
  ]).exec(function (err, posts) {
    return res.status(200).json({ posts });
  });
};
// Recuperation d'un post ...............................................
exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => res.status(200).json(post))
    .catch((error) => res.status(400).json(error));
};

// Creation d'un post ..................................................

exports.createPost = (req, res, next) => {
  let image = "";
  if (req.file) {
    image = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  }
  const post = new Post({
    userId: req.body.userId,
    postText: req.body.postText,
    imageUrl: image,
    likes: 0,
    date: Date.now(),
  });
  post.save()
    .then(() => res.status(201).json({ message: "Post créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

//modification d'un post ....................................................
exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? {
        postText: req.body.postText,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
          req.file.filename
        }`,
      }
    : { postText: req.body.postText };

  delete postObject._userId;
  Post.findOne({ _id: req.params.id })

    .then((post) => {
      if (post.userId != req.body.userId || req.body.isAdmin) {
        res.status(403).json({ message: 'Unauthorized request' });
      } else {
        //Gestion de l'image lors de la modification d'un post
        if (req.file) {
          const filename = post.imageUrl.split('/images/')[1];
          if (fs.existsSync(`images/${filename}`)) {
            fs.unlinkSync(`images/${filename}`);
          }
        }

        Post.updateOne(
          { _id: req.params.id },
          { ...postObject, _id: req.params.id }
        )
          .then(res.status(200).json({ message: 'Objet modifié!' }))
          .catch((error) => res.status(401).json({ error }));
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

//Suppression d'un post .....................................................
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }).then((post) => {
    //vérifier celui qui veut supprimer le post est bien l'auteur du post
    if (post.userId != req.body.userId) {
      res.status(403).json({ message: 'Unauthorized request' });
    } else {
      Post.deleteOne({ _id: req.params.id })
        .then(() => {
          if (post.imageUrl) {
            const filename = post.imageUrl.split('/images/')[1];
            const imagePath = `images/${filename}`;
            if (fs.existsSync(imagePath)) {
              fs.unlink(imagePath, (err) => {
                if (err) {
                  throw err;
                }
              });
            }
          }
          res.status(200).json({
            message: 'Deleted!',
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    }
})}

//like d'un post .....................................................
exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id })
    .then((post) => {
      if (req.body.like == 1) {
        post.usersLiked.push(req.body.userId);
        post.likes += req.body.like;
      }
      if (
        post.usersLiked.indexOf(req.body.userId) != -1 &&
        req.body.like == 0
      ) {
        const likesIndex = post.usersLiked.findIndex(
          (user) => user === req.body.userId
        );
        post.usersLiked.splice(likesIndex, 1);
        post.likes -= 1;
      }
      post.save();
      res.status(201).json({ message: "Avis modifié !" });
    })
    .catch((error) => res.status(500).json({ error }));
};


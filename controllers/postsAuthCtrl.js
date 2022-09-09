//-----------Modules import---------
const Posts = require('../models/postModels');


module.exports = async (req, res, next) => {
  console.log(req.body);
  await Posts.findOne({ where: { postId: req.params.id } })
    .then((post) => {
      if (post.userId == req.body.userId || req.body.isAdmin) {
        next();
      } else {
        res
          .status(401)
          .json({ message: "Not allowed to modify or delete this post !" });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

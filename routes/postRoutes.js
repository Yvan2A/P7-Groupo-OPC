const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const postCtrl = require("../controllers/postControllers");
const postsAuthCtrl = require('../controllers/postsAuthCtrl');

router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getOnePost);
router.post("/", auth, multer, postCtrl.createPost);
router.put("/:id", postsAuthCtrl, auth, multer, postCtrl.modifyPost);
router.delete("/:id",postsAuthCtrl, auth, postCtrl.deletePost);
router.post("/:id/like", auth, postCtrl.likePost);


module.exports = router;

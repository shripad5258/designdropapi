import express from "express";
import { body } from "express-validator";

import { loginUser, singupUser } from "../controller/user-controller.js";
import {
  newComment,
  getComments,
  deleteComment,
} from "../controller/comment-controller.js";

import {
  createPost,
  updatePost,
  deletePost,
  getPost,
  getAllPosts,
  getPostByUserID,
} from "../controller/post-controller.js";

import { authenticateToken } from "../middlewares/jwt-controller.js";
//image
import upload from "../utils/upload.js";
import { uploadImage, getImage } from "../controller/image-controller.js";

const router = express.Router();

///USER

router.post(
  "/signup",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  singupUser
);
router.post(
  "/login",
  [body("email").isEmail(), body("password").isLength({ min: 5 })],
  loginUser
);

///////POST

router.post(
  "/create",
  authenticateToken,
  [
    body("title", "Title must be atleast 3 characters").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  createPost
);

router.put(
  "/update/:id",
  authenticateToken,
  [
    body("title", "Title must be atleast 3 characters").isLength({ min: 3 }),
    body("description", "Description must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  updatePost
);

router.delete("/delete/:id", authenticateToken, deletePost);

/// Fetch POSTs
router.get("/post/:id", getPost);
router.get("/posts", getAllPosts);
router.get(
  "/user/posts/:id([0-9a-fA-F]{24})",
  authenticateToken,
  getPostByUserID
);

//FILE UPlOAd
router.post("/file/upload", upload.single("file"), uploadImage);
router.get("/file/:filename", getImage);

//COMMENT
router.post("/comment/new", authenticateToken, newComment);
router.get("/comments/:id", getComments);
router.delete("/comment/delete/:id", authenticateToken, deleteComment);

export default router;

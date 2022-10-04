import Post from "../model/post.js";
import { validationResult } from "express-validator";

//CREATEPOST///

export const createPost = async (request, response) => {
  let success = false;
  try {
    const { title, description, tag, createdBy, picture, firstname, lastname } =
      request.body;

    // If there are errors, return Bad request and the errors
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(400).json({ errors: errors.array() });
    }
    const post = new Post({
      title,
      description,
      tag,
      postImageUrl: picture,
      createdBy: createdBy,
      firstname,
      lastname,
    });
    const savedPost = await post.save();

    response.json({
      savedPost,
      success: true,
      msg: "Blog successfully upload",
    });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ success: false, msg: "Internal Server Error" });
  }
};

//UPDATEPOST///

export const updatePost = async (request, response) => {
  let success = false;
  const { title, description, tag, picture } = request.body;

  // If there are errors, return Bad request and the errors
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() });
  }

  try {
    // Create a newNote object
    const newPost = {};
    if (title) {
      newPost.title = title;
    }
    if (description) {
      newPost.description = description;
    }
    if (tag) {
      newPost.tag = tag;
    }
    if (picture) {
      newPost.postImageUrl = picture;
    }

    // Find the note to be updated and update it
    let post = await Post.findById(request.params.id);
    if (!post) {
      return response.status(404).send({ success, msg: "Not Found" });
    }

    if (JSON.stringify(post.user) !== request.user_id) {
      return response.status(401).send({ success, msg: "Not Allowed" });
    }

    post = await Post.findByIdAndUpdate(
      request.params.id,
      { $set: newPost },
      { new: true }
    );
    response.json({ success: true, post });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ success, msg: "Internal Server Error" });
  }
};

///DELETE POST

export const deletePost = async (request, response) => {
  let success = false;
  try {
    // Find the note to be delete and delete it
    let post = await Post.findById(request.params.id);
    if (!post) {
      return response.status(404).send({ success, msg: "Not Found" });
    }

    // Allow deletion only if user owns this Note
    if (JSON.stringify(post.user) !== request.user_id) {
      return response.status(401).send({ success, msg: "Not Allowed" });
    }

    post = await Post.findByIdAndDelete(request.params.id);
    await post.delete();
    response.json({ success: true, msg: "Blog Successfully deleted " });
  } catch (error) {
    console.error(error.message);
    response.status(500).send({ success, msg: "Internal Server Error" });
  }
};

///GET ALL POSTS
// res.setHeader('Access-Control-Allow-Origin', '*');
// res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
// res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
// res.setHeader('Access-Control-Allow-Credentials', true); // If needed


export const getAllPosts = async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
  response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
  response.setHeader('Access-Control-Allow-Credentials', true); // If needed

  try {
    const posts = await Post.find({});
    response.json(posts);
  } catch (error) {
    console.error(error.message);
    response.status(500).send("Internal Server Error");
  }
};

//GET ONE POST

export const getPost = async (request, response) => {
  try {
    const post = await Post.findById(request.params.id);
    response.status(200).json(post);
  } catch (error) {
    response.status(500).json(error);
  }
};

const getPost1 = async (userId) => {
  return await Post.find({ createdBy: userId });
};

export const getPostByUserID = async (request, response) => {
  try {
    // const result = await getPost1(request.params.id);
    const result = await Post.find({ createdBy: request.params.id });
    console.log("result");

    response.send(result);
  } catch (error) {
    return response.status(500).json({ error: error.toString() });
  }
};

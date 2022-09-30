import Comment from "../model/comment.js";
import User from "../model/user.js";

export const newComment = async (request, response) => {
  const { comment, postId, createdBy } = request.body;

  try {
    const user = await User.findById(createdBy);
    const username = `${user.firstname} ${user.lastname}`;

    const newComment = { comment, postId, createdBy, username };

    const createcomment = await new Comment(newComment);
    createcomment.save();

    response.status(200).json({ username, msg: "Comment saved successfully" });
  } catch (error) {
    response.status(500).json(error);
  }
};

export const getComments = async (request, response) => {
  try {
    const comments = await Comment.find({ postId: request.params.id });

    response.status(200).json(comments);
  } catch (error) {
    response.status(500).json(error);
  }
};

export const deleteComment = async (request, response) => {
  try {
    const comment = await Comment.findById(request.params.id);
    await comment.delete();

    response.status(200).json("comment deleted successfully");
  } catch (error) {
    response.status(500).json(error);
  }
};

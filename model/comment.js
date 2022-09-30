import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now, required: true },
  createdBy: { type: mongoose.Schema.ObjectId, ref: "user", required: true },

  comment: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const comment = mongoose.model("comment", CommentSchema);

export default comment;

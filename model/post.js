import mongoose from "mongoose";
var date = new Date();

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  postImageUrl: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  tag: {
    type: String,
    default: "Architecture",
  },

  createdAt: { type: Date, default: date.toDateString(), required: true },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const post = mongoose.model("post", PostSchema);

export default post;

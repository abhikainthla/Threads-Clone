import Post from "../models/postModles.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, image } = req.body;
    if (!postedBy || !text) {
      return res
        .status(400)
        .json({ error: "Posted by and text feild is required" });
    }
    const user = await User.findById(postedBy);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    if (user._id.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not authorized to create post" });
    }
    const maxLength = 500;
    if (text.length > maxLength) {
      return res
        .status(400)
        .json({ error: `Text should be less than ${maxLength} characters` });
    }
    const newPost = new Post({ postedBy, text, image });
    await newPost.save();
    res.json({ message: "Post created successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in createPost", error.message);
  }
};

const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getPost", error.message);
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    if (post.postedBy.toString() !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ error: "You are not authorized to delete this post" });
    }
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in getPost", error.message);
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const userId = req.user._id;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const isLiked = post.likes.includes(userId);
    if (isLiked) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      return res.status(200).json({ message: "post unliked successfully" });
    } else {
      post.likes.push(userId);
      await post.save();
      res.status(200).json({ message: "post liked successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in likeUnlikePost", error.message);
  }
};

const replyToPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;
    const userProfilePic = req.user.profilePic || "";
    const username = req.user.username;
    const post = await Post.findById(postId);
    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    const reply = {userId, text, userProfilePic, username};
    post.replies.push(reply);
    await post.save();
    res.status(201).json({ message: "Reply added successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log("Error in replyToPost", error.message);
  }
};

const getFeedPosts = async (req, res) => {
  try {
    const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		const following = user.following;

		const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 });

		res.status(200).json(feedPosts);
  } catch (error) {
      res.status(500).json({ message: error.message });
      console.error("Error in getFeedPosts", error.message);
  }
};

export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getFeedPosts };

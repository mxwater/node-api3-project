const express = require('express');
const {
  validateUserId,
  validateUser,
  validatePost,
} = require('../middleware/middleware')
const User = require('../users/users-model');
const Post = require('../posts/posts-model')

// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.get(); // User.get() should return all users
    res.json(users); // Ensure you send the entire array of users
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving users' });
  }
});


router.get('/:id', validateUserId, (req, res) => {
  res.json(req.user);
});

router.post('/', validateUser, async (req, res) => {
  try {
    const newUser = await User.insert(req.body);
    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ message: 'Error creating the user' });
  }
});

router.put('/:id', validateUserId, validateUser, async (req, res) => {
  try {
    const updatedUser = await User.update(req.params.id, req.body);
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error updating the user' });
  }
});

router.delete('/:id', validateUserId, async (req, res) => {
  try {
  const deletedUser = req.user;
   await User.remove(req.params.id);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ message: 'Error deleting the user' });
  }
});

router.get('/:id/posts', validateUserId, async (req, res) => {
  try {
    const posts = await User.getUserPosts(req.params.id);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Error retrieving posts' });
  }
});

router.post('/:id/posts', validateUserId, validatePost, async (req, res) => {
  const postData = {
    user_id: req.params.id, // Ensure the post is linked to the correct user
    text: req.body.text,    // Get the post content from the request body
  };

  try {
    const newPost = await Post.insert(postData);
    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ message: 'Error creating the post' });
  }
});

// do not forget to export the router
module.exports = router

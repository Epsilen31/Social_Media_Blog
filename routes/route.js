const express = require('express');
const router = express.Router();
const { register, login, createPost, getAllPosts, getUserPosts, getPostCountsByUser } = require('../controllers/controller');
const authMiddleware = require('../middleware/authmiddlware');

router.post('/register', register);
router.post('/login', login);
router.post('/posts/create', authMiddleware, createPost);
router.get('/posts', getAllPosts);
router.get('/posts/user/:userId', getUserPosts);
router.get('/postCountsByUser', getPostCountsByUser);

module.exports = router;

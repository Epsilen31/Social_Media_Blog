const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Post } = require('../models/model');

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(username, email, password);

        //check if user already exist
        const existingUser = await User.findOne({ email });
        console.log(existingUser)

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already Exists',
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email, password)
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }
        const payload = {
            email: user.email,
            id: user._id,
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log("Token :", token);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const createPost = async (req, res) => {
    try {
        const user = req.user; // This user object is set during authentication middleware
        const post = new Post({ title: req.body.title, content: req.body.content, user: user.id });
        await post.save();
        res.status(201).json({ message: 'Post created successfully' });
    } catch (error) {
        res.status(500).json({
            message: error.message,
            error: 'An error occurred'
        });
    }
};

const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('user', 'username');
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log(userId)
        const posts = await Post.findById(userId)
        console.log(posts)
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

const getPostCountsByUser = async (req, res) => {
    try {
        const postCounts = await Post.aggregate([
            {
                $group: {
                    _id: '$user',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(postCounts);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
};

module.exports = { register, login, createPost, getAllPosts, getUserPosts, getPostCountsByUser };

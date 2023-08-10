const jwt = require('jsonwebtoken');
require("dotenv").config();

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log("Token ->", token);
    if (!token) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    try {

        //verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log("decodedToken-> ", decodedToken);
        req.user = decodedToken;
        console.log(" req.user -> ", req.user);
        next();

    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = authMiddleware;

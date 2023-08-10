const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const routes = require('./routes/route');

const app = express();
require("dotenv").config();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Connect to MongoDB
const connectDb = require("./config/database");
connectDb();

// Routes
app.use('/api/v1', routes);

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

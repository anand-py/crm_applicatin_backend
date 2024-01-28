// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import configuration files
const serverConfig = require('./configs/server.config');
const dbConfig = require('./configs/db.config');

// Import models and routes
const User = require('./models/user.model');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes')

// Create an instance of the express application
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json({}));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Use the authentication routes
app.use(authRoutes);
app.use(userRoutes);

// Connect to the database
mongoose.connect(dbConfig.DB_URL);
const db = mongoose.connection;
db.on('error', () => {
    console.log('error while connecting to db');
});
db.once('open', () => {
    console.log('connected to db');
});

// Start the server
app.listen(serverConfig.PORT, () => {
    console.log(`Application started on port num : ${serverConfig.PORT}`);
});
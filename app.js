const express = require('express');
const bodyParser = require('body-parser');
const User = require('./models/User');  // Import the User model
const app = express();
const mongoose = require('mongoose');
const path = require('path');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.static('public')); // For serving HTML and CSS files
app.use(express.static(path.join(__dirname,'public')))
app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname,  'signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,  'login.html'));
});


// Replace with your MongoDB connection string
mongoose.connect('mongodb://localhost:27017/auth_db')
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('Connection error', err));


// Signup Route
app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            // Redirect with error message as a query parameter
            return res.redirect(`/signup?error=Email already exists`);
        }

        const newUser = new User({ username, email, password });
        await newUser.save();
        res.send('Signup successful');
    } catch (err) {
        res.status(400).send('Error creating user: ' + err.message);
    }
});



// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (user) {
        res.send('Login successful');
    } else {
        // Redirect with error message as a query parameter
        return res.redirect(`/login?error=Invalid email or password`);
    }
});



// Listen to the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

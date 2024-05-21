const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifyToken'); 
const app = express();
const port = 3000;

const secretKey = '123456789'; 

// Mock user data
const users = [
    {
        id: 1,
        email: 'user@example.com',
        password: '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXX' 
    }
];

app.use(express.json());

// Login route
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }

    bcrypt.compare(password, user.password, (err, result) => {
        if (err || !result) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    });
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

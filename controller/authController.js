const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getData, postData } = require('./dbController');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

async function registerUser(req, res) {
    try {
        console.log('Request body:', req.body);

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            console.log('Missing fields');
            return res.status(400).json({ message: 'All fields are required' });
        }

        const normalizedEmail = email.toLowerCase();
        console.log('Normalized Email:', normalizedEmail);


        const users = await getData('users', { email: normalizedEmail });
        console.log('Users found:', users);

        if (users.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword);


        const insertResult = await postData('users', {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            createdAt: new Date()
        });
        console.log('Insert result:', insertResult);


        if (insertResult && insertResult.insertedId)
 {
            res.status(201).json({ message: 'User registered successfully' });
        } else {
            throw new Error('User insertion failed');
        }
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}



async function loginUser(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const normalizedEmail = email.toLowerCase();


        const users = await getData('users', { email: normalizedEmail });
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const user = users[0];


        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }


        const token = jwt.sign(
            { id: user._id.toString(), email: user.email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: { id: user._id.toString(), name: user.name, email: user.email }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { registerUser, loginUser };

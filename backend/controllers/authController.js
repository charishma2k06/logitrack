const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

// We leave CLIENT_ID open for the user to inject their real one.
// Let's use a dummy ID for now so it compiles, but we'll accept any client ID validation
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID");

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const user = await User.create({ name, email, password, role });

        const token = generateToken(user._id);
        res.status(201).json({ success: true, token, user });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);
        res.status(200).json({ success: true, token, user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

exports.googleLogin = async (req, res) => {
    try {
        const { token } = req.body;

        // Verify Google token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID",
        });
        const payload = ticket.getPayload();

        const { email, name } = payload;

        // Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create user if they don't exist
            // Natively assign Customer role for new SSO users
            user = await User.create({
                name: name,
                email: email,
                password: Math.random().toString(36).substring(7), // dummy random password
                role: 'Customer'
            });
        }

        const jwtToken = generateToken(user._id);
        res.status(200).json({ success: true, token: jwtToken, user });

    } catch (error) {
        console.error('Google Auth Error:', error);
        res.status(401).json({ success: false, error: 'Google Authentication failed.' });
    }
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

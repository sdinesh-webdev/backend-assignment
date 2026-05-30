"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const supabase_1 = require("../supabase");
const router = (0, express_1.Router)();
// Register a new user
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const { data, error } = await supabase_1.supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            res.status(400).json({ error: error.message });
            return;
        }
        res.status(201).json({ message: 'User registered successfully', user: data.user, session: data.session });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Login user
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required' });
            return;
        }
        const { data, error } = await supabase_1.supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) {
            res.status(401).json({ error: error.message });
            return;
        }
        res.json({ message: 'Login successful', user: data.user, session: data.session });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;

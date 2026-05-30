"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = void 0;
const supabase_1 = require("../supabase");
const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
            return;
        }
        const token = authHeader.split(' ')[1];
        // Verify the token using Supabase
        const { data: { user }, error } = await supabase_1.supabase.auth.getUser(token);
        if (error || !user) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
        // Attach user to request object
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(500).json({ error: 'Internal server error during authentication' });
    }
};
exports.requireAuth = requireAuth;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply requireAuth middleware to all task routes
router.use(auth_1.requireAuth);
// Example protected route
router.get('/', (req, res) => {
    // Access the authenticated user via req.user
    const user = req.user;
    res.json({
        message: 'This is a protected route. You can only see this if you are logged in.',
        user: {
            id: user.id,
            email: user.email
        }
    });
});
exports.default = router;

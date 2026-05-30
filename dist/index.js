"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const tasks_1 = __importDefault(require("./routes/tasks"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// MIDDLEWARE
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express_1.default.json());
// ROUTES
app.use('/api/auth', auth_1.default);
app.use('/api/tasks', tasks_1.default);
// Basic health check route
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});
// Example route using Supabase
app.get('/api/test-supabase', async (req, res) => {
    try {
        // Just a test query, replace 'your_table' with an actual table if needed
        // const { data, error } = await supabase.from('your_table').select('*').limit(1);
        res.json({ status: 'ok', message: 'Supabase client is configured' });
    }
    catch (error) {
        res.status(500).json({ error: 'Supabase error' });
    }
});
// 404 HANDLER
app.use((req, res) => {
    res.status(404).json({ error: 'ROUTE Not Found' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

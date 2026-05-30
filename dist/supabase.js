"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_KEY;
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials. Make sure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are in your .env file.');
    process.exit(1);
}
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);

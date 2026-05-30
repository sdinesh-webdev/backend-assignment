import express, { Request, Response } from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import taskRoutes from './routes/tasks'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors({
    origin: process.env.CLIENT_URL || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    
}));
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the Task Management API. Valid routes include /api/auth, /api/tasks, and /health' });
});

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Example route using Supabase
app.get('/api/test-supabase', async (req: Request, res: Response) => {
  try {
    // Just a test query, replace 'your_table' with an actual table if needed
    // const { data, error } = await supabase.from('your_table').select('*').limit(1);
    res.json({ status: 'ok', message: 'Supabase client is configured' });
  } catch (error) {
    res.status(500).json({ error: 'Supabase error' });
  }
});

// 404 HANDLER
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'ROUTE Not Found' });
});

// Only start the server locally. Vercel will import this app and handle the server.
if (process.env.NODE_ENV !== 'production' && process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

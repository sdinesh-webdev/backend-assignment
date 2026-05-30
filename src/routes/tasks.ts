import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { supabase } from '../supabase';

const router = Router();

// Apply requireAuth middleware to all task routes
router.use(requireAuth);

// GET all tasks for logged-in user
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// POST create a new task
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert({ title, description, user_id: req.user.id })
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    
    res.status(201).json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update a task (title, description, status)
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;

    const { data, error } = await supabase
      .from('tasks')
      .update({ title, description, status })
      .eq('id', taskId)
      .eq('user_id', req.user.id)
      .select()
      .single();

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    
    res.json(data);
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', req.user.id);

    if (error) {
      res.status(500).json({ error: error.message });
      return;
    }
    
    res.status(204).send();
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;

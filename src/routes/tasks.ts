import { Router, Request, Response } from 'express';
import { requireAuth } from '../middleware/auth';
import { supabaseAsUser } from '../supabase';

const router = Router();

// Apply requireAuth middleware to all task routes
router.use(requireAuth);

/**
 * Helper: extract the raw JWT from the Authorization header.
 * requireAuth already validated it, so this will always succeed here.
 */
const getToken = (req: Request): string =>
  req.headers.authorization!.split(' ')[1];

// ── GET all tasks for logged-in user ──────────────────────────────────────
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const db = supabaseAsUser(getToken(req));

    const { data, error } = await db
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.json(data);
  } catch (err: any) {
    console.error('Get tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// ── POST create a new task ────────────────────────────────────────────────
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description } = req.body;

    if (!title || !title.trim()) {
      res.status(400).json({ error: 'Title is required' });
      return;
    }

    const db = supabaseAsUser(getToken(req));

    const { data, error } = await db
      .from('tasks')
      .insert({
        title: title.trim(),
        description: description?.trim() || '',
        user_id: req.user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase insert error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(201).json(data);
  } catch (err: any) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// ── PUT update a task (title, description, status) ────────────────────────
// Only fields explicitly provided in the request body are updated —
// this prevents accidentally nulling out columns that were not sent.
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, description, status } = req.body;
    const taskId = req.params.id;

    // Validate status value if provided
    if (status !== undefined && !['pending', 'completed'].includes(status)) {
      res.status(400).json({ error: 'Status must be "pending" or "completed"' });
      return;
    }

    // Build a sparse update payload — never include undefined keys
    const updates: Record<string, string> = {};
    if (title !== undefined)       updates.title       = title.trim();
    if (description !== undefined) updates.description = description.trim();
    if (status !== undefined)      updates.status      = status;

    if (Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'No fields provided to update' });
      return;
    }

    const db = supabaseAsUser(getToken(req));

    const { data, error } = await db
      .from('tasks')
      .update(updates)
      .eq('id', taskId)
      .eq('user_id', req.user.id) // RLS double-check: only the owner can edit
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    if (!data) {
      res.status(404).json({ error: 'Task not found or access denied' });
      return;
    }

    res.json(data);
  } catch (err: any) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ── DELETE a task ─────────────────────────────────────────────────────────
// Returns 200 + JSON body (not 204 No-Content) so fetchWithAuth can safely
// call response.json() without throwing on an empty body.
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const taskId = req.params.id;
    const db = supabaseAsUser(getToken(req));

    const { error } = await db
      .from('tasks')
      .delete()
      .eq('id', taskId)
      .eq('user_id', req.user.id);

    if (error) {
      console.error('Supabase delete error:', error);
      res.status(500).json({ error: error.message });
      return;
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err: any) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

export default router;

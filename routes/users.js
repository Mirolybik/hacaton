import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { validate } from '../validate.js';

const router = Router();

// Временное хранилище вместо БД
const users = new Map();

const createUserSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: z.email('Invalid email'),
  age: z.coerce.number().int().min(18).optional(),
});

const idSchema = z.object({ id: z.uuid('Invalid user id') });

router.get('/', (req, res) => {
  res.json({ data: [...users.values()] });
});

router.post('/', validate(createUserSchema), (req, res) => {
  const user = { id: randomUUID(), ...req.body };
  users.set(user.id, user);
  req.log.info({ userId: user.id }, 'user created');
  res.status(201).json({ data: user });
});

router.get('/:id', validate(idSchema, 'params'), (req, res) => {
  const user = users.get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ data: user });
});

router.delete('/:id', validate(idSchema, 'params'), (req, res) => {
  if (!users.delete(req.params.id)) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
});

export default router;

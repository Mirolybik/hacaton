import { Router } from 'express';
import { create, getById, list, stats, take, update } from './request.controller';

export const requestRouter = Router();

requestRouter.post('/', create);
requestRouter.get('/', list);
requestRouter.get('/stats', stats);
requestRouter.get('/:id', getById);
requestRouter.patch('/:id', update);
requestRouter.post('/:id/take', take);

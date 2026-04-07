import express from 'express';
import { getAllRooms, getRoom, createRoom, updateRoom } from '../controllers/roomController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getAllRooms)
  .post(protect, restrictTo('admin'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, restrictTo('admin'), updateRoom);

export default router;

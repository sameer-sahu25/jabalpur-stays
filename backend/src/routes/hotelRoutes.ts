import express from 'express';
import { getAllHotels, getHotel, createHotel, updateHotel, getRoomsByHotel } from '../controllers/hotelController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.route('/')
  .get(getAllHotels)
  .post(protect, restrictTo('admin'), createHotel);

router.get('/:id/rooms', getRoomsByHotel);

router.route('/:id')
  .get(getHotel)
  .put(protect, restrictTo('admin'), updateHotel);

export default router;

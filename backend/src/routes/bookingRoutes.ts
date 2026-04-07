import express from 'express';
import { createBooking, getUserBookings, getBooking, cancelBooking } from '../controllers/bookingController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect); // All booking routes require login

router.route('/')
  .post(createBooking);

router.get('/user/:userId', getUserBookings);

router.route('/:id')
  .get(getBooking);

router.put('/:id/cancel', cancelBooking);

export default router;

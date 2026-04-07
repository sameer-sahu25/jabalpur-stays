import express from 'express';
import { getAllOffers, createOffer, updateOffer, validateOfferCode } from '../controllers/offerController';
import { protect, restrictTo } from '../middleware/auth';

const router = express.Router();

router.post('/validate', protect, validateOfferCode);

router.route('/')
  .get(getAllOffers)
  .post(protect, restrictTo('admin'), createOffer);

router.route('/:id')
  .put(protect, restrictTo('admin'), updateOffer);

export default router;

import express from 'express';
import { submitMessage, subscribeNewsletter } from '../controllers/contactController';

const router = express.Router();

router.post('/message', submitMessage);
router.post('/newsletter', subscribeNewsletter);

export default router;

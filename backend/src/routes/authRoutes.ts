import express from 'express';
import { register, login, logout } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', (req, res) => {
  // Implement refresh token logic if needed, usually requires storing refresh tokens in DB
  res.status(501).json({ message: 'Not implemented' });
});

export default router;

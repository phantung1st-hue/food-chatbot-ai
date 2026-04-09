import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authMiddleware } from '../middleware/auth.js';
import { createUser, findUserByEmail, findUserById } from '../db/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu phải có ít nhất 6 ký tự.' });
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã tồn tại.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = createUser({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Đăng ký thành công.',
      token,
      user: { id: user.id, name, email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu.' });
    }

    const user = findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Tài khoản không tồn tại.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Sai mật khẩu.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

    return res.json({
      message: 'Đăng nhập thành công.',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Lỗi máy chủ.', error: error.message });
  }
});

router.get('/me', authMiddleware, (req, res) => {
  const user = findUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'Không tìm thấy người dùng.' });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    created_at: user.created_at
  });
});

export default router;

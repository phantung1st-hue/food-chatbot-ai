import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import './db/database.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'https://food-chatbot-ai.vercel.app',
      'https://food-chatbot-ai-1.onrender.com'
    ],
    credentials: true
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Food Chatbot API đang chạy.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
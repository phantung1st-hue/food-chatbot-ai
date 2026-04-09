import express from 'express';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { authMiddleware } from '../middleware/auth.js';
import { createChat, getChatsByUserId, deleteChatsByUserId } from '../db/database.js';

const router = express.Router();

router.get('/history', authMiddleware, (req, res) => {
  return res.json(getChatsByUserId(req.user.id));
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Vui lòng nhập nội dung.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Thiếu GEMINI_API_KEY trong file .env của backend.' });
      
    }

    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const systemPrompt = `Bạn là chatbot tư vấn đồ ăn bằng tiếng Việt.
    - Gợi ý món ăn theo ngân sách, số người, thời gian trong ngày và sở thích.
    - Trả lời ngắn gọn, dễ hiểu, trình bày đẹp.
    - Khi phù hợp, hãy gợi ý thêm nguyên liệu, cách làm ngắn gọn và chi phí ước lượng.
    - Chỉ tập trung vào chủ đề đồ ăn, thực đơn, nguyên liệu và cách chế biến.`;
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

const result = await model.generateContent(
  systemPrompt + "\n\nUser: " + message
);


const response = await result.response;
const botMessage = response.text();
 

    
     


    createChat({
      userId: req.user.id,
      userMessage: message,
      botMessage
    });

    return res.json({ reply: botMessage });
  } catch (error) {
    console.error(error); // in lỗi ra terminal
  
    return res.status(500).json({
      message: "Lỗi khi gọi Gemini API"
    });
  }
  
});

router.delete('/', authMiddleware, (req, res) => {
  try {
    deleteChatsByUserId(req.user.id);
    return res.json({ message: 'Đã xóa lịch sử chat' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Lỗi khi xóa lịch sử chat' });
  }
});

export default router;

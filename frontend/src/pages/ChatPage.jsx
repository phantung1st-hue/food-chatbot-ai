import ReactMarkdown from 'react-markdown';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

import { API_URL } from '../config/api';

export default function ChatPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: `Xin chào ${user?.name || ''}! Tôi có thể gợi ý món ăn, thực đơn hoặc cách nấu đơn giản cho bạn.`
    }
  ]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleDeleteHistory = async () => {
    const token = localStorage.getItem('token');

    if (!window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử chat?')) return;

    await fetch(`${API_URL}/api/chat`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert('Đã xóa lịch sử chat');
    window.location.reload();
  };

  const handleSelectHistory = (item) => {
    setMessages([
      {
        sender: 'user',
        text: item.user_message
      },
      {
        sender: 'bot',
        text: item.bot_message
      }
    ]);
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_URL}/api/chat/history`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setHistory(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchHistory();
  }, [navigate, token]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = { sender: 'user', text: message };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage.text })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Gửi tin nhắn thất bại');

      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      setHistory((prev) => [
        {
          user_message: userMessage.text,
          bot_message: data.reply,
          created_at: new Date().toISOString()
        },
        ...prev
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: `Lỗi: ${error.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page chat-bg">
      <Navbar />
      <div className="chat-layout">
        <aside className="sidebar">
          <h3>Lịch sử chat</h3>
          <p className="sidebar-sub">20 cuộc hội thoại gần nhất</p>

          <button
            onClick={handleDeleteHistory}
            style={{
              marginTop: '10px',
              marginBottom: '15px',
              padding: '6px 10px',
              borderRadius: '8px',
              border: 'none',
              background: '#e85d3f',
              color: 'white',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Xóa lịch sử chat
          </button>

          <div className="history-list">
            {history.length === 0 ? (
              <p className="empty-state">Chưa có lịch sử chat.</p>
            ) : (
              history.map((item, index) => (
                <div
                  key={index}
                  className="history-card"
                  onClick={() => handleSelectHistory(item)}
                  style={{ cursor: 'pointer' }}
                >
                  <strong>Q:</strong> {item.user_message}
                  <div className="history-answer">
                    <strong>A:</strong> {item.bot_message.slice(0, 100)}...
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <main className="chat-main">
          <div className="chat-header">
            <h2>Chatbot tư vấn món ăn</h2>
            <span className="online-dot">Đang hoạt động</span>
          </div>

          <div className="chat-box">
            {messages.map((msg, index) => (
              <div key={index} className={`bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              {msg.sender === 'bot' ? (
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              ) : msg.text}
              </div>
            ))}
            {loading && <div className="bubble bot-bubble">FoodBot đang suy nghĩ...</div>}
          </div>

          <form className="chat-form" onSubmit={sendMessage}>
            <input
              type="text"
              placeholder="Ví dụ: Gợi ý món ăn tối dưới 100k cho 2 người"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button type="submit" className="primary-btn">Gửi</button>
          </form>
        </main>
      </div>
    </div>
  );
}
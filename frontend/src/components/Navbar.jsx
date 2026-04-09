import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">FoodBot</Link>
      <div className="nav-links">
        {!token ? (
          <>
            <Link to="/login" className="btn-nav">Đăng nhập</Link>
            <Link to="/register" className="btn-nav">Đăng ký</Link>
          </>
        ) : (
          <>
            <span className="user-pill">Xin chào, {user?.name || 'User'}</span>
            <Link to="/chat">Chatbot</Link>
            <button className="btn-logout" onClick={handleLogout}>Đăng xuất</button>
          </>
        )}
      </div>
    </nav>
  );
}

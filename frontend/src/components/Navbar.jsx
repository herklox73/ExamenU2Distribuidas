// src/components/Navbar.jsx
import { useNavigate } from 'react-router-dom';
import { logout } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const name = (() => {
    try {
      const token = localStorage.getItem('token');
      const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
return JSON.parse(decodeURIComponent(escape(atob(base64)))).name;
    } catch { return 'Usuario'; }
  })();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav style={{ display:'flex', justifyContent:'space-between', alignItems:'center',
                  padding:'12px 24px', backgroundColor:'#f0f0f0',
                  borderBottom:'1px solid #ccc', color:'#000' }}>
      <span style={{ fontWeight:'bold', fontSize:16 }}>Northwind App — {name}</span>
      <button onClick={handleLogout}
        style={{ padding:'7px 16px', cursor:'pointer', backgroundColor:'#c0392b',
                 color:'white', border:'none', borderRadius:4, fontSize:13 }}>
        Cerrar sesion
      </button>
    </nav>
  );
}
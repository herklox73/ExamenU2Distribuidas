// src/pages/LoginPage.jsx
import { loginWithGoogle } from '../services/api';

export default function LoginPage() {
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center',
                  justifyContent:'center', height:'100vh', gap:16,
                  backgroundColor:'#fff', color:'#000' }}>
      <h1 style={{ fontSize:28 }}>Northwind App</h1>
      <p style={{ color:'#555' }}>Gestion de productos — Examen U2</p>
      <button onClick={loginWithGoogle}
        style={{ padding:'11px 28px', fontSize:15, cursor:'pointer',
                 backgroundColor:'#4285F4', color:'white', border:'none',
                 borderRadius:6 }}>
        Iniciar sesion con Google
      </button>
    </div>
  );
}
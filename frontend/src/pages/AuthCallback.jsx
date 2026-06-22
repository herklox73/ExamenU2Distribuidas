import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token  = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      navigate('/products');
    } else {
      navigate('/');
    }
  }, []);

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center',
                  height:'100vh' }}>
      Autenticando...
    </div>
  );
}
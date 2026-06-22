import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage    from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import ProductsPage from './pages/ProductsPage';
import Navbar       from './components/Navbar';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"              element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/products"      element={
          <PrivateRoute>
            <Navbar />
            <ProductsPage />
          </PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error en la solicitud');
  return data;
};

export const loginWithGoogle = () => {
  window.location.href = `${BASE_URL}/auth/google`;
};


export const logout = async () => {
    try {
      await fetch(`${BASE_URL}/auth/logout`, { method: 'POST', headers: headers() });
    } catch(e) {
      console.error('Error en logout:', e);
    } finally {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
  };

export const getProducts = () =>
  fetch(`${BASE_URL}/products`, { headers: headers() }).then(handleResponse);

export const searchProducts = (q) =>
  fetch(`${BASE_URL}/products/search?q=${q}`, { headers: headers() }).then(handleResponse);

export const createProduct = (data) =>
  fetch(`${BASE_URL}/products`, {
    method: 'POST', headers: headers(), body: JSON.stringify(data),
  }).then(handleResponse);

export const updateProduct = (id, data) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'PUT', headers: headers(), body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteProduct = (id) =>
  fetch(`${BASE_URL}/products/${id}`, {
    method: 'DELETE', headers: headers(),
  }).then(handleResponse);

export const purchase = (product_id, quantity) =>
  fetch(`${BASE_URL}/orders/purchase`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({ product_id, quantity }),
  }).then(handleResponse);
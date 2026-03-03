import axios from 'axios';

const API = axios.create({
  baseURL: '/api/',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Token ${token}`;
  }
  return req;
});

// Dishes
export const getDishes    = ()         => API.get('dishes/');
export const createDish   = (dish)     => API.post('dishes/', dish);
export const updateDish   = (id, data) => API.put(`dishes/${id}/`, data);
export const deleteDish   = (id)       => API.delete(`dishes/${id}/`);

// Auth
export const loginUser    = (creds)    => API.post('auth-token/', creds);

// Comments
export const getComments  = (dishId)   => API.get(`comments/?dish=${dishId}`);
export const createComment= (data)     => API.post('comments/', data);
export const deleteComment= (id)       => API.delete(`comments/${id}/`);
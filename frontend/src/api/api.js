import axios from 'axios';

const API = axios.create({ baseURL: '/api/' });

// Attach token automatically from localStorage
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Token ${token}`;
  return req;
});

// Auth
export const loginUser    = (creds) => API.post('users/login/', creds);
export const registerUser = (data)  => API.post('users/', data);
export const getMe        = ()      => API.get('users/me/');

// Dishes
export const getDishes = () => API.get('dishes/');

export const getDish = (id) => API.get(`dishes/${id}/`);  // ← added for DishDetail page

export const createDish = (dish) => {
  const formData = new FormData();
  formData.append('name', dish.name);
  formData.append('description', dish.description);
  formData.append('price', dish.price);
  if (dish.cultural_notes)     formData.append('cultural_notes', dish.cultural_notes);
  if (dish.preparation_steps)  formData.append('preparation_steps', dish.preparation_steps);
  if (dish.image)              formData.append('image', dish.image);

  return API.post('dishes/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateDish = (id, formData) => {
  // Accepts a FormData directly from EditDishForm
  // Uses PATCH so only changed fields are sent — prevents overwriting existing data
  return API.patch(`dishes/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deleteDish  = (id) => API.delete(`dishes/${id}/`);
export const restoreDish = (id) => API.post(`dishes/${id}/restore/`);

// Comments
export const getComments   = (dishId) => API.get(`comments/?dish=${dishId}`);
export const createComment = (data)   => API.post('comments/', data);
export const deleteComment = (id)     => API.delete(`comments/${id}/`);

// Community photos
export const getCommunityPhotos = (dishId) => API.get(`community-photos/?dish=${dishId}`);
export const createCommunityPhoto = (formData) =>
  API.post('community-photos/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Upload dish image
export const uploadDishImage = (id, file) => {
  const formData = new FormData();
  formData.append('image', file);
  return API.patch(`dishes/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
import api from './api';

export const login = async (email, senha) => {
  const response = await api.post('/login', { email, senha }, {
    withCredentials: true 
  });

  return response.data.user;
};

export const getCurrentUser = async () => {
  const response = await api.get('/login/me');
  return response.data;
};
import api from './api';

export const login = async (email, senha) => {
  const response = await api.post('/login', { email, senha }, {
    withCredentials: true 
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/me');
  return response.data.user;
};


export const register = async ({ nome, email, senha }) => {
  try {
    const response = await api.post("/users", {
      nome,
      email,
      senha,
      papel: "USUARIO"
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.error || 'Erro no cadastro';
    throw new Error(message);
  }
};
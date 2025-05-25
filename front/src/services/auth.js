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
  const response = await api.post("/users", {
    nome, email, senha, papel:"USUARIO"
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erro no cadastro');
  }

  return response.data
};
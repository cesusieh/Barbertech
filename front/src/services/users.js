import api from './api'

export const getBarbers = async() => {
    const response = await api.get("/barbers")
    return response.data
}

export const createBarber = async (barbeiroData) => {
  try {
    const response = await api.post('/users', barbeiroData, { withCredentials: true })
    return response.data
  } catch (error) {
    const errMsg = error.response?.data?.error || 'Erro ao criar barbeiro'
    throw new Error(errMsg)
  }
}

export const updateBarber = async (id, barbeiroData) => {
  try {
    const response = await api.put(`/barbers/${id}`, barbeiroData, { withCredentials: true });
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.error || 'Erro ao atualizar barbeiro';
    throw new Error(errMsg);
  }
};
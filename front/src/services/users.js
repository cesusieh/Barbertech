import api from './api'

export const getBarbers = async() => {
    const response = await api.get("/barbeiros")
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
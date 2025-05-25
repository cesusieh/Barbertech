import api from './api'

export const getBarbers = async() => {
    const response = await api.get("/barbeiros")
    return response.data
}
import api from './api';

export const createAppointment = async (formData) => {
  try {
    const payload = {
      ...formData,
      barbeiroId: parseInt(formData.barbeiroId)
    };

    const response = await api.post('/appointments', payload, {
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.error || 'Erro ao agendar';
    throw new Error(errMsg);
  }
};

export const getAppointments = async () => {
  try {
    const response = await api.get('/appointments', {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    const errMsg = error.response?.data?.error || 'Erro ao buscar agendamentos';
    throw new Error(errMsg);
  }
};

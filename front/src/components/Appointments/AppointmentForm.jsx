import React, { useState, useEffect, useContext } from 'react';
import api from '../../services/api';
import { AuthContext } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';



const AppointmentForm = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [formData, setFormData] = useState({
    data: '',
    barbeiroId: '',
    status: 'AGENDADO',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBarbeiros = async () => {
      try {
        const response = await api.get('/users');
        const barbeiros = response.data.filter((u) => u.papel === 'BARBEIRO');
        setBarbeiros(barbeiros);
        if (barbeiros.length > 0) {
          setFormData((prev) => ({ ...prev, barbeiroId: barbeiros[0].id }));
        }
      } catch (error) {
        console.error('Erro ao buscar barbeiros:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBarbeiros();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/agendamentos', {
        ...formData,
        clienteId: user.userId,
      });
      navigate('/appointments');
    } catch (err) {
      setError('Erro ao criar agendamento');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Novo Agendamento</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="data">
            Data e Hora
          </label>
          <input
            type="datetime-local"
            id="data"
            className="w-full p-2 border rounded"
            value={formData.data}
            onChange={(e) => setFormData({ ...formData, data: e.target.value })}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="barbeiroId">
            Barbeiro
          </label>
          <select
            id="barbeiroId"
            className="w-full p-2 border rounded"
            value={formData.barbeiroId}
            onChange={(e) => setFormData({ ...formData, barbeiroId: e.target.value })}
            required
          >
            {barbeiros.map((barbeiro) => (
              <option key={barbeiro.id} value={barbeiro.id}>
                {barbeiro.nome}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="w-full p-2 border rounded"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            required
          >
            <option value="AGENDADO">Agendado</option>
            <option value="CONCLUIDO">Concluído</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Agendar
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
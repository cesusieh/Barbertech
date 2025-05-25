import React, { useState, useEffect } from 'react';
import { getBarbers } from '../services/users';
import { createAppointment, getAppointments } from '../services/appointments';
import { Link } from 'react-router-dom';

const Home = ({ isLoggedIn }) => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [formData, setFormData] = useState({
    data: '',
    barbeiroId: '',
    status: 'AGENDADO'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agendamentosRecentes, setAgendamentosRecentes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const barbeirosData = await getBarbers();
        setBarbeiros(barbeirosData);

        const agendamentos = await getAppointments();
        setAgendamentosRecentes(agendamentos.slice(0, 3)); // pega só os 3 primeiros
      } catch (err) {
        console.error('Erro:', err);
      }
    };

    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createAppointment(formData);
      alert('Agendamento realizado com sucesso!');
      setFormData({
        data: '',
        barbeiroId: '',
        status: 'AGENDADO'
      });

      // Atualiza a lista após novo agendamento
      const updated = await getAppointments();
      setAgendamentosRecentes(updated.slice(0, 3));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="p-8 text-center">
      {isLoggedIn ? (
        <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md space-y-8">
          <h2 className="text-2xl font-bold text-gray-800">Agendar Serviço</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left">
            <div>
              <label htmlFor="data" className="block text-sm font-medium text-gray-700 mb-1">
                Data e Hora
              </label>
              <input
                type="datetime-local"
                id="data"
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label htmlFor="barbeiroId" className="block text-sm font-medium text-gray-700 mb-1">
                Barbeiro
              </label>
              <select
                id="barbeiroId"
                name="barbeiroId"
                value={formData.barbeiroId}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione um barbeiro</option>
                {barbeiros.map(barbeiro => (
                  <option key={barbeiro.id} value={barbeiro.id}>
                    {barbeiro.nome}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 py-2 px-4 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {loading ? 'Agendando...' : 'Confirmar Agendamento'}
            </button>
          </form>

          {agendamentosRecentes.length > 0 && (
            <div className="mt-8 text-left">
              <h3 className="text-lg font-semibold mb-3 text-gray-800">Seus Agendamentos Recentes</h3>
              <ul className="space-y-2">
                {agendamentosRecentes.map((agendamento) => (
                  <li key={agendamento.id} className="p-3 border rounded shadow-sm">
                    <p><strong>Data:</strong> {new Date(agendamento.data).toLocaleString('pt-BR')}</p>
                    <p><strong>Barbeiro:</strong> {agendamento.barbeiro?.nome || 'N/A'}</p>
                    <p><strong>Status:</strong> {agendamento.status}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Link
                  to="/agendamentos"
                  className="text-blue-600 hover:underline"
                >
                  Ver todos os agendamentos →
                </Link>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo à Barbearia</h1>
          <p className="text-gray-600">Faça login para agendar seu horário com nossos barbeiros.</p>
        </div>
      )}
    </div>
  );
};

export default Home;

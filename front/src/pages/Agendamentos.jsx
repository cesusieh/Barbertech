import React, { useEffect, useState } from 'react';
import { getAppointments } from '../services/appointments';
import { useNavigate } from 'react-router-dom';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAppointments();
        setAgendamentos(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Agendamentos</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Agendar
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Data</th>
              <th className="border p-2">Barbeiro</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((agendamento) => (
              <tr key={agendamento.id} className="hover:bg-gray-50">
                <td className="border p-2">{agendamento.id}</td>
                <td className="border p-2">
                  {new Date(agendamento.data).toLocaleString('pt-BR')}
                </td>
                <td className="border p-2">{agendamento.barbeiro?.nome || 'Desconhecido'}</td>
                <td className="border p-2">{agendamento.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Agendamentos;

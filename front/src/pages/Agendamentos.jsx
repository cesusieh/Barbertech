import React, { useEffect, useState } from 'react';
import { getAppointments, updateAppointmentStatus } from '../services/appointments';
import { useNavigate } from 'react-router-dom';

const Agendamentos = () => {
  const [agendamentos, setAgendamentos] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [user, setUser] = useState(null);
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

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Erro ao ler user do localStorage:', err);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Agendamentos</h1>

        {user?.papel === 'USUARIO' && (
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Agendar
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Data</th>
              <th className="border p-2">Barbeiro</th>
              <th className="border p-2">Cliente</th>
              <th className="border p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((agendamento) => (
              <tr key={agendamento.id} className="hover:bg-gray-50">
              
                <td className="border p-2">
                  {new Date(agendamento.data).toLocaleString('pt-BR')}
                </td>
                <td className="border p-2">
                  {agendamento.barbeiro?.nome || 'Desconhecido'}
                </td>
                <td className="border p-2">
                  {agendamento.cliente?.nome || 'Desconhecido'}
                </td>
                <td className="border p-2">
                  <div className="flex justify-between items-center gap-2">
                    <span>{agendamento.status}</span>

                    {agendamento.status !== 'FINALIZADO' && agendamento.status !== 'CANCELADO' && (
                      <div className="flex gap-2">
                        {(user?.papel === 'BARBEIRO' || user?.papel === 'GERENTE') && (
                          <button
                            onClick={async () => {
                              try {
                                await updateAppointmentStatus(agendamento.id, 'FINALIZADO');
                                setAgendamentos((prev) =>
                                  prev.map((item) =>
                                    item.id === agendamento.id
                                      ? { ...item, status: 'FINALIZADO' }
                                      : item
                                  )
                                );
                                setSuccess('Agendamento concluído com sucesso!');
                                setTimeout(() => setSuccess(''), 3000);
                              } catch (err) {
                                console.error(err);
                                setError('Erro ao concluir agendamento');
                                setTimeout(() => setError(''), 3000);
                              }
                            }}
                            className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                          >
                            Concluir
                          </button>
                        )}

                        {(user?.papel === 'USUARIO' ||
                          user?.papel === 'BARBEIRO' ||
                          user?.papel === 'GERENTE') && (
                          <button
                            onClick={async () => {
                              try {
                                await updateAppointmentStatus(agendamento.id, 'CANCELADO');
                                setAgendamentos((prev) =>
                                  prev.map((item) =>
                                    item.id === agendamento.id
                                      ? { ...item, status: 'CANCELADO' }
                                      : item
                                  )
                                );
                                setSuccess('Agendamento cancelado com sucesso!');
                                setTimeout(() => setSuccess(''), 3000);
                              } catch (err) {
                                console.error(err);
                                setError('Erro ao cancelar agendamento');
                                setTimeout(() => setError(''), 3000);
                              }
                            }}
                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Agendamentos;

import React, { useState, useEffect } from 'react';

const Home = ({ isLoggedIn }) => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [formData, setFormData] = useState({
    data: '',
    barbeiroId: '',
    status: 'AGENDADO'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Carrega barbeiros quando o componente monta
  useEffect(() => {
    if (isLoggedIn) {
      const fetchBarbeiros = async () => {
        try {
          const response = await fetch('http://localhost:3333/barbeiros', {
            credentials: 'include'
          });
          const data = await response.json();
          setBarbeiros(data);
        } catch (err) {
          console.error('Erro ao carregar barbeiros:', err);
        }
      };
      fetchBarbeiros();
    }
  }, [isLoggedIn]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3333/agendamentos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao agendar');
      }

      // Limpa o formulário após sucesso
      setFormData({
        data: '',
        barbeiroId: '',
        status: 'AGENDADO'
      });
      
      alert('Agendamento realizado com sucesso!');
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
    <div>
      <div className="p-8 text-center">
        {isLoggedIn ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Agendar Serviço</h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label htmlFor="data" className="block text-sm font-medium text-gray-700 text-left mb-1">
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
                <label htmlFor="barbeiroId" className="block text-sm font-medium text-gray-700 text-left mb-1">
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

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 text-left mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="AGENDADO">Agendado</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="CANCELADO">Cancelado</option>
                  <option value="FINALIZADO">Finalizado</option>
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
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Bem-vindo à Barbearia</h1>
            <p className="text-gray-600">Faça login para agendar seu horário com nossos barbeiros.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
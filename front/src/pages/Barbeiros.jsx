import React, { useState, useEffect } from 'react';
import { getBarbers, createBarber } from '../services/users';

const Barbeiros = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({ nome: '', email: '', senha: '' });
  const [successMsg, setSuccessMsg] = useState('');
  const [showForm, setShowForm] = useState(false); // 👈 estado para alternar

  useEffect(() => {
    fetchBarbeiros();
  }, []);

  const fetchBarbeiros = async () => {
    setLoading(true);
    try {
      const data = await getBarbers();
      setBarbeiros(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!formData.nome || !formData.email || !formData.senha) {
      setError('Preencha todos os campos');
      return;
    }

    try {
      await createBarber({ ...formData, papel: 'BARBEIRO' });
      setSuccessMsg('Barbeiro criado com sucesso!');
      setFormData({ nome: '', email: '', senha: '' });
      fetchBarbeiros();
      setShowForm(false); // opcional: voltar pra tabela após adicionar
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Barbeiros</h1>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          {showForm ? 'Ver Lista' : 'Adicionar Barbeiro'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="mb-6 max-w-md">
          {error && <p className="text-red-600 mb-2">{error}</p>}
          {successMsg && <p className="text-green-600 mb-2">{successMsg}</p>}

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Nome do barbeiro"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Email do barbeiro"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-semibold">Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Senha"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Adicionar Barbeiro
          </button>
        </form>
      ) : loading ? (
        <p>Carregando barbeiros...</p>
      ) : barbeiros.length === 0 ? (
        <p>Nenhum barbeiro encontrado.</p>
      ) : (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">ID</th>
              <th className="border p-2">Nome</th>
              <th className="border p-2">Email</th>
            </tr>
          </thead>
          <tbody>
            {barbeiros.map(({ id, nome, email }) => (
              <tr key={id} className="hover:bg-gray-50">
                <td className="border p-2">{id}</td>
                <td className="border p-2">{nome}</td>
                <td className="border p-2">{email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Barbeiros;

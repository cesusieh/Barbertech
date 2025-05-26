import React, { useState, useEffect } from 'react';
import { getBarbers, createBarber, updateBarber } from '../services/users';

const Barbeiros = () => {
  const [barbeiros, setBarbeiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });

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

    const { nome, email, senha } = formData;
    if (!nome || !email || (!editingId && !senha)) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      if (editingId) {
        await updateBarber(editingId, { nome, email, senha, papel: 'BARBEIRO' });
      } else {
        await createBarber({ ...formData, papel: 'BARBEIRO' });
      }

      setFormData({ nome: '', email: '', senha: '' });
      setEditingId(null);
      fetchBarbeiros();
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (barbeiro) => {
    setFormData({ nome: barbeiro.nome, email: barbeiro.email, senha: '' });
    setEditingId(barbeiro.id);
    setShowForm(true);
    setError('');
  };

  const handleCancelEdit = () => {
    setFormData({ nome: '', email: '', senha: '' });
    setEditingId(null);
    setShowForm(false);
    setError('');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Barbeiros</h1>
        <button
          onClick={() => {
            setShowForm((prev) => !prev);
            setFormData({ nome: '', email: '', senha: '' });
            setEditingId(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? 'Ver Lista' : 'Adicionar Barbeiro'}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="mb-6 max-w-md">
          {error && <p className="text-red-600 mb-2">{error}</p>}

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
            <label className="block mb-1 font-semibold">
              Senha {editingId ? '(deixe em branco se não quiser alterar)' : ''}
            </label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2"
              placeholder="Senha"
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Atualizar Barbeiro' : 'Adicionar Barbeiro'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="text-red-600 hover:underline"
              >
                Cancelar Edição
              </button>
            )}
          </div>
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
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {barbeiros.map((barbeiro) => (
              <tr key={barbeiro.id} className="hover:bg-gray-50">
                <td className="border p-2">{barbeiro.id}</td>
                <td className="border p-2">{barbeiro.nome}</td>
                <td className="border p-2">{barbeiro.email}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleEdit(barbeiro)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Barbeiros;

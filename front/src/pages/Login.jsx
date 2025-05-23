import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3333/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
        credentials: 'include' // Importante para cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro no login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token); // Opcional, se quiser armazenar também no localStorage
      setIsLoggedIn(true);
      navigate('/');
    } catch (err) {
      setError(err.message);
      console.error('Erro no login:', err);
    }
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 text-base border rounded"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="p-2 text-base border rounded"
          required
        />
        <button 
          type="submit" 
          className="p-2 bg-gray-800 text-white border-none cursor-pointer hover:bg-gray-700 transition"
        >
          Entrar
        </button>
      </form>
    </div>
  );
};

export default Login;
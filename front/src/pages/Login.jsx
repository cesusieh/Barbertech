import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, login, register } from '../services/auth';

const Login = ({ setIsLoggedIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [nome, setNome] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

    try {
      if (isLogin) {
        await login(email, senha);
        const user = await getCurrentUser();

        localStorage.setItem("user", JSON.stringify(user));
        setIsLoggedIn(true);

        // Redirecionamento com base no papel
        if (user.papel === 'GERENTE') {
          navigate('/agendamentos', { replace: true });
        } else {
          navigate('/', { replace: true });
        }
      } else {
        await register({ nome, email, senha });
        alert('Cadastro realizado com sucesso! Faça login.');
        setIsLogin(true);
        setEmail('');
        setSenha('');
        setNome('');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">{isLogin ? 'Login' : 'Cadastro'}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col gap-4">
        {!isLogin && (
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="p-2 text-base border rounded"
            required
          />
        )}
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
          {isLogin ? 'Entrar' : 'Cadastrar'}
        </button>
      </form>

      <p className="mt-4 text-sm text-gray-600">
        {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-500 hover:underline"
        >
          {isLogin ? 'Cadastre-se' : 'Fazer login'}
        </button>
      </p>
    </div>
  );
};

export default Login;

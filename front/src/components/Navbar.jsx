import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import atualizado
import { AuthContext } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate(); // Hook atualizado

  const handleLogout = () => {
    logout();
    navigate('/login'); // Navegação atualizada
  };

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">
          Barbearia
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              {user.papel === 'GERENTE' && (
                <Link to="/users" className="hover:text-gray-300">
                  Usuários
                </Link>
              )}
              <Link to="/appointments" className="hover:text-gray-300">
                Agendamentos
              </Link>
              <span className="text-gray-300">Olá, {user.nome}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Sair
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
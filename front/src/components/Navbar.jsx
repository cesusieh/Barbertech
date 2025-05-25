import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3333/logout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">Meu Site</div>
      <div className="flex gap-4">
        {isLoggedIn ? (
          <>
            <Link 
              to="/agendamentos" 
              className="text-white px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
            >
              Agendamentos
            </Link>
            <button 
              onClick={handleLogout}
              className="text-white px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link 
            to="/login" 
            className="text-white px-4 py-2 rounded bg-gray-600 hover:bg-gray-700 transition"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

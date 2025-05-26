import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ Obtem o path atual
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (err) {
        console.error('Erro ao ler user do localStorage:', err);
      }
    }
  }, [isLoggedIn]);

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

  // ✅ Verifica se está na página de barbeiros
  const isOnBarbeirosPage = location.pathname === '/barbeiros';

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
      <div className="text-xl font-bold">Meu Site</div>
      <div className="flex gap-4 items-center">
        {isLoggedIn && user?.papel === 'GERENTE' && (
          <Link
            to={isOnBarbeirosPage ? '/agendamentos' : '/barbeiros'}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 transition"
          >
            {isOnBarbeirosPage ? 'Agendamentos' : 'Barbeiros'}
          </Link>
        )}
        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="text-white px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition"
          >
            Logout
          </button>
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

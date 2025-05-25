import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Navbar from './components/Navbar';
import Agendamentos from './pages/Agendamentos';

const ProtectedRoute = ({ children, user }) => {
  if (user?.papel === 'GERENTE') {
    return <Navigate to="/agendamentos" replace />;
  }

  return children;
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Erro ao fazer parse do user no localStorage:', error);
        setUser(null);
      }
    }

    setIsLoadingUser(false);
  }, []);

  if (isLoadingUser) return null;

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute user={user}>
              <Home isLoggedIn={isLoggedIn} />
            </ProtectedRoute>
          }
        />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
      </Routes>
    </Router>
  );
}

export default App;

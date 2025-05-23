import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Navbar from './components/Navbar';
import UserList from './components/Users/UserList';
import AppointmentList from './components/Appointments/AppointmentList';
import AppointmentForm from './components/Appointments/AppointmentForm';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Rotas protegidas */}
            <Route element={<PrivateRoute roles={['GERENTE']} />}>
              <Route path="/users" element={<UserList />} />
            </Route>
            
            <Route element={<PrivateRoute />}>
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/appointments/new" element={<AppointmentForm />} />
            </Route>
            
            <Route path="/" element={<div>Bem-vindo ao sistema de agendamentos</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
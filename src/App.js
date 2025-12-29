import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import './components/Login.css';
import './components/Dashboard.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <AuthProvider>
      {currentPage === 'login' && <Login onNavigate={handleNavigate} />}
      {currentPage === 'dashboard' && <Dashboard onNavigate={handleNavigate} />}
      {currentPage === 'signup' && <Login onNavigate={handleNavigate} />}
    </AuthProvider>
  );
}

export default App;

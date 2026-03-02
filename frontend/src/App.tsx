import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css'
import Login from './pages/Login';
import Home from './pages/Home';

const App = () => {
  const isAuthenticated = false;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route 
          path="/dashboard" 
          element={isAuthenticated 
            ? <Home /> 
            : <Navigate to="/login" />
          } 
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App

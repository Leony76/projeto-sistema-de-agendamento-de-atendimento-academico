import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import './App.css'
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/middleware/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import Students from './pages/Students';
import ManagerRoute from './components/middleware/ManagerRoute';
import { ToastProvider } from './contexts/ToastContext';

const App = () => {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path='/'
              element={<Login />}
            />

            <Route 
              path="/login" 
              element={<Login />} 
            />

            <Route 
              path="/home" 
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              } 
            />

            <Route 
              path="/students" 
              element={
                <PrivateRoute>
                  <ManagerRoute>
                    <Students/>
                  </ManagerRoute>
                </PrivateRoute>
              } 
            />   
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App

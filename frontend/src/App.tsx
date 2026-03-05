import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import './App.css'
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/middleware/PrivateRoute';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
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
          path="*" 
          element={<Navigate to="/login"/>} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App

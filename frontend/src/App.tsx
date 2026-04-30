import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './web/( unauthenticated )/Login';
import Register from './web/( unauthenticated )/Register';
import Home from './web/( authenticated )/home';
import Schedule from './web/( authenticated )/Schedule';
import Requests from './web/( authenticated )/Requests';
import History from './web/( authenticated )/History';
import { UserDetails } from './components/misc/UserDetails';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<Login/>} />
          <Route path="/register" element={<Register/>} />

          <Route path="/home"     element={<Home/>} >
            <Route path="student/:id"   element={<UserDetails/>} />
            <Route path="professor/:id" element={<UserDetails/>} />
            <Route path="manager/:id"   element={<UserDetails/>} />
          </Route>

          <Route path="/schedule" element={<Schedule/>} />
          <Route path="/requests" element={<Requests/>} />
          <Route path="/history"  element={<History/>} />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
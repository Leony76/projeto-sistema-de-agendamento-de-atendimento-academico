import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './web/( unauthenticated )/Login';
import Register from './web/( unauthenticated )/Register';
import Home from './web/( authenticated )/home';
import Schedule from './web/( authenticated )/Schedule';
import Requests from './web/( authenticated )/Solicitations';
import History from './web/( authenticated )/History';
import { UserDetails } from './components/misc/UserDetails';
import { ToastProvider } from './contexts/ToastContext';
import { AuthenticatedRoute } from './routes/AuthenticatedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"         element={<Login/>} />
            <Route path="/register" element={<Register/>} />

            <Route element={<AuthenticatedRoute/>}>
              <Route element={<RoleRoute allowedRoles={['MANAGER', 'PROFESSOR', 'STUDENT']}/>}>
                <Route path="/home" element={<Home/>}>
                  <Route element={<RoleRoute allowedRoles={['MANAGER']}/>}>
                    <Route path="professor/:id" element={<UserDetails/>} />
                    <Route path="student/:id"   element={<UserDetails/>} />
                    <Route path="manager/:id"   element={<UserDetails/>} />
                  </Route>
                </Route>

                <Route element={<RoleRoute allowedRoles={['STUDENT', 'PROFESSOR']}/>}>
                  <Route path="/schedule"      element={<Schedule/>} />
                  <Route path="/solicitations" element={<Requests/>} />
                  <Route path="/history"       element={<History/>}  />
                </Route>
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
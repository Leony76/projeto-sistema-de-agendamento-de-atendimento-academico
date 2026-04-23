import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './web/( unauthenticated )/Login';
import Register from './web/( unauthenticated )/Register';
import Home from './web/( authenticated )/home';
import Schedule from './web/( authenticated )/Schedule';
import Requests from './web/( authenticated )/Requests';
import History from './web/( authenticated )/History';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        <Route path="/home"     element={<Home/>} />
        <Route path="/schedule" element={<Schedule/>} />
        <Route path="/requests" element={<Requests/>} />
        <Route path="/history"  element={<History/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
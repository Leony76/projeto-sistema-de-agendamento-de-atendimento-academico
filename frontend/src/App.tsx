import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './web/( unauthenticated )/Login';
import Register from './web/( unauthenticated )/Register';
import Home from './web/( authenticated )/home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/register" element={<Register/>} />

        <Route path="/home" element={<Home/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
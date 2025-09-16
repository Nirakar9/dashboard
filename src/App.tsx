import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from './components/pages/Login';
import Dashboard from './components/pages/Dashboard';
import Appointments from './components/pages/Appointments';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/appointments" element={<Appointments />} />

      </Routes>
    </Router>
  );
}

export default App;

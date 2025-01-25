import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/dashBoard';
import Stock from './pages/stock';
import Home from './pages/home';
import { SignUpForm } from './pages/signup';
import { LoginForm } from './pages/login';
import QueryProvider from '@/components/QueryProvider';
import Houses from './pages/houses';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/houses" element={<Houses />} />
          <Route path="/signup" element={<SignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </Router>
    </QueryProvider>
  );
}

export default App;

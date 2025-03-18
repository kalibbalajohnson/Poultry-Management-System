import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashBoard';
import StockPage from './pages/stock';
import HomePage from './pages/home';
import SignUpPage from './pages/signup';
import LoginPage from './pages/login';
import QueryProvider from '@/components/QueryProvider';
import BatchPage from './pages/batch';
import ProductionPage from './pages/production';
import ImmunizationPage from './pages/immunization';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/immunization" element={<ImmunizationPage />} />
          <Route path="/birds" element={<BatchPage />} />
          <Route path="/production" element={<ProductionPage />} />
          <Route path="/signup" element={<SignUpPage logo={{
            src: '',
            alt: ''
          }} />} />
          <Route path="/login" element={<LoginPage logo={{
            src: '',
            alt: ''
          }} />} />
        </Routes>
      </Router>
    </QueryProvider>
  );
}

export default App;

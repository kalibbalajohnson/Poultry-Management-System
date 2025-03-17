import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardPage from './pages/dashBoard';
import StockPage from './pages/stock';
import HomePage from './pages/home';
import SignUpPage from './pages/signup';
import LoginPage from './pages/login';
import QueryProvider from '@/components/QueryProvider';
import HousesPage from './pages/houses';
import ImmunizationPage from './pages/immunization';
import DiagnosisPage from './pages/diagnosis';
import StaffPage from './pages/staff';

function App() {
  return (
    <QueryProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/stock" element={<StockPage />} />
          <Route path="/immunization" element={<ImmunizationPage />} />
          <Route path="/diagnosis" element={<DiagnosisPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/houses" element={<HousesPage />} />
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

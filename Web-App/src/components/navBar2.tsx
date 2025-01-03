import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../firebase/auth/authService';
import { useState } from 'react';

function Navbar2() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const handleLogout = async () => {
    if (logout) {
      await logout();
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  return (
    <header className="bg-gradient-to-r from-green-700 to-green-800 py-5 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link to="/">
          <h1 className="text-3xl font-bold tracking-wide">
            Poultry Farm Management
          </h1>
        </Link>

        <nav className="flex items-center space-x-6">
          <button
            onClick={handleLogout}
            className="rounded px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-md"
          >
            Logout
          </button>

          <div className="flex items-center">
            <img
              src="farm.jpg"
              alt="User Avatar"
              className="h-9 w-9 rounded-full border border-white bg-white"
            />
            <p className="ml-3 font-semibold text-white">
              {' '}
              {user?.email || 'User'}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar2;

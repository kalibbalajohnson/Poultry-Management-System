import { useNavigate } from 'react-router-dom';
// import { logout } from '../firebase/auth/authService';
import { useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Bell } from 'lucide-react';

function Navbar2() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem('user') || '{}'));

  const handleLogout = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="border-b py-3">
      <div className="container mx-auto flex items-center justify-between px-6">
        <SidebarTrigger />
        <nav className="flex items-center space-x-6">
          <Bell className="w-6 h-6 text-gray-700" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="bg-gray-200 rounded-full w-9 h-9 flex items-center justify-center">
                <p className="font-semibold text-gray-600">
                  {user?.email ? user.email[0].toUpperCase() : 'U'}
                </p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuLabel><button
                onClick={handleLogout}>Logout
              </button></DropdownMenuLabel>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}

export default Navbar2;

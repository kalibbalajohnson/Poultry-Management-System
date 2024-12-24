import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="bg-gradient-to-r from-green-700 to-green-800 text-white py-5 shadow">
      <div className="container mx-auto flex items-center justify-between px-6">
        <Link
          to="/"
        >
          <h1 className="text-3xl font-bold tracking-wide">
            Poultry Farm Management
          </h1>
        </Link>

        <nav className="flex items-center space-x-6">

        </nav>

        <nav className="flex items-center space-x-6">
          <Link
            to="/login"
            className="text-white font-semibold px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-600 hover:shadow-md"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-white text-green-700 font-semibold px-4 py-2 rounded transition duration-300 ease-in-out hover:bg-green-100 hover:shadow-md"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;

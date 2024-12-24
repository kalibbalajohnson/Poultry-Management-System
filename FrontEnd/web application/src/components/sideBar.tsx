import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow text-sm p-6 ">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-3 rounded-md bg-green-700 text-white font-medium"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/stock"
              className="block py-2 px-3 rounded hover:bg-green-100 text-gray-700 font-medium"
            >
              Stock Management
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-3 rounded hover:bg-green-100 text-gray-700 font-medium"
            >
              Disease
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-3 rounded hover:bg-green-100 text-gray-700 font-medium"
            >
              View Records
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block py-2 px-3 rounded hover:bg-green-100 text-gray-700 font-medium"
            >
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

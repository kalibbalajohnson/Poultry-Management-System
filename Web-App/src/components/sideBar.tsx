import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside className="w-64 bg-white p-6 text-sm shadow">
      <nav>
        <ul className="space-y-2">
          <li>
            <Link
              to="/dashboard"
              className="block rounded-md bg-green-700 px-3 py-2 font-medium text-white"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/stock"
              className="block rounded px-3 py-2 font-medium text-gray-700 hover:bg-green-100"
            >
              Stock Management
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block rounded px-3 py-2 font-medium text-gray-700 hover:bg-green-100"
            >
              Disease
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block rounded px-3 py-2 font-medium text-gray-700 hover:bg-green-100"
            >
              View Records
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard"
              className="block rounded px-3 py-2 font-medium text-gray-700 hover:bg-green-100"
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

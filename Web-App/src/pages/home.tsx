import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex-col-2 flex min-h-screen bg-gray-50 bg-gradient-to-r px-2 pb-16 text-gray-900">
        <div className="mx-auto mt-10 max-w-lg rounded-lg bg-white p-10 shadow">
          <h1 className="mb-4 text-4xl font-extrabold leading-tight text-green-700">
            Welcome to Poultry Pal
          </h1>
          <p className="mb-6 text-lg text-gray-600">
            Manage your poultry farm’s daily records efficiently and
            effortlessly.
          </p>
          <p className="text-md mb-4 text-gray-500">
            Our application harnesses the power of AI and machine learning to
            provide predictive insights, enabling you to optimize your farm
            operations like never before.
          </p>
          <p className="text-md mb-4 text-gray-500">
            From tracking egg production to analyzing feed efficiency, our
            intelligent models help you make informed decisions that lead to
            better productivity and profitability.
          </p>

          <Link
            to="/dashboard"
            className="inline-block transform rounded-lg bg-gradient-to-r from-green-500 to-blue-500 px-8 py-3 font-semibold text-white shadow-md transition duration-300 hover:scale-105 hover:from-green-600 hover:to-blue-600 hover:shadow-lg"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="mx-auto mt-12 flex max-w-2xl flex-grow items-center justify-center opacity-80">
          <div className="text-left">
            <img
              src="farm.jpg"
              alt="Poultry Farm"
              className="mb-4 rounded-lg shadow-md"
            />
            <p className="text-md mt-4 text-gray-500">
              Embrace the future of poultry farming with our smart solutions
              that help you monitor health metrics, predict production trends,
              and enhance overall farm management.
            </p>
            <p className="text-md mt-2 text-gray-500">
              Join us in revolutionizing poultry farming through technology and
              data-driven strategies!
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

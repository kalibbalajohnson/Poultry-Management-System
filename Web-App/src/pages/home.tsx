import { Link } from 'react-router-dom';
import Navbar from '../components/navBar';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-r px-2 pb-16 text-gray-900">
        <div className="mx-auto md:mt-6 max-w-lg rounded-lg p-10 md:w-1/2">
          <h1 className="mb-4 text-4xl font-semibold leading-tight">
            Welcome to Poultry Pal
          </h1>
          <p className="mb-6 text-gray-600">
            Manage your poultry farm’s daily records efficiently and effortlessly.
          </p>
          <p className="text-sm mb-4 text-gray-500">
            Our application harnesses the power of AI and machine learning to
            provide predictive insights, enabling you to optimize your farm
            operations like never before.
          </p>
          <p className="text-sm mb-12 text-gray-500">
            From tracking egg production to analyzing feed efficiency, our
            intelligent models help you make informed decisions that lead to
            better productivity and profitability.
          </p>
          <Link to="/dashboard">
            <Button>
              Go to Dashboard
            </Button>
          </Link>
        </div>
        <div className="mx-auto mt-6 md:mt-8 flex max-w-2xl flex-grow items-center justify-center opacity-80 md:w-1/2">
          <div className="text-left">
            <img
              src="farm.jpg"
              alt="Poultry Farm"
              className="mb-2 rounded-lg shadow-md w-full sm:w-auto"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
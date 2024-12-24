import { Link } from "react-router-dom";
import Navbar from "../components/navBar";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col-2 pb-16 px-2 min-h-screen bg-gradient-to-r bg-gray-50 text-gray-900">
        <div className="bg-white p-10 rounded-lg shadow max-w-lg mx-auto mt-10">
          <h1 className="text-4xl font-extrabold mb-4 text-green-700 leading-tight">
            Welcome to Poultry Pal
          </h1>
          <p className="text-lg mb-6 text-gray-600">
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
            className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-semibold rounded-lg shadow-md transform transition duration-300 hover:scale-105 hover:shadow-lg hover:from-green-600 hover:to-blue-600"
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="flex-grow flex items-center justify-center mt-12 max-w-2xl mx-auto opacity-80">
          <div className="text-left">
            
            <img
              src="farm.jpg"
              alt="Poultry Farm"
              className="rounded-lg shadow-md mb-4"
            />
            <p className="text-md text-gray-500 mt-4">
              Embrace the future of poultry farming with our smart solutions
              that help you monitor health metrics, predict production trends,
              and enhance overall farm management.
            </p>
            <p className="text-md text-gray-500 mt-2">
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

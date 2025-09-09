/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";

const NotFound = ({ route }: any) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-secondary">404</h1>
        <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
          Page Not Found
        </h2>
        <p className="mt-2 text-gray-600">
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </p>
        <Link
          to={route}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-secondary text-white text-sm font-medium hover:bg-secondary transition-all"
        >
          <BsArrowLeftCircle className="w-5 h-5" />
          Go Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

import { useNavigate, useRouteError } from "react-router-dom";
import { motion } from "framer-motion";
import { FiAlertTriangle, FiHome, FiRefreshCw } from "react-icons/fi";

export default function ErrorPage() {
  const error = useRouteError?.();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-lg"
      >
        {/* Icon */}
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="inline-block mb-6"
        >
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FiAlertTriangle className="text-red-500 text-5xl" />
          </div>
        </motion.div>

        <h1 className="text-4xl font-display font-bold text-dark-900 mb-3">
          Oops! Something Went Wrong
        </h1>
        <p className="text-gray-500 text-lg mb-3">
          We ran into an unexpected error. Don't worry, it's not your fault!
        </p>

        {error?.statusText && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 text-left">
            <p className="text-red-600 text-sm font-mono">{error.statusText || error.message}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
          <button
            onClick={() => window.location.reload()}
            className="btn-outline flex items-center justify-center gap-2"
          >
            <FiRefreshCw /> Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <FiHome /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

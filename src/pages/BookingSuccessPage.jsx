import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiHome } from "react-icons/fi";

export default function BookingSuccessPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}
        className="card p-10 text-center max-w-md w-full">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
          <FiCheckCircle className="text-green-500 text-7xl mx-auto mb-6" />
        </motion.div>
        <h1 className="text-3xl font-display font-bold text-dark-900 mb-3">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-6">Your payment was successful and your booking is now pending owner approval.</p>
        {state?.transactionId && (
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-xs text-gray-400 mb-1">Transaction ID</p>
            <p className="text-sm font-mono text-gray-700 break-all">{state.transactionId}</p>
            {state.amount && (
              <>
                <p className="text-xs text-gray-400 mt-3 mb-1">Amount Paid</p>
                <p className="text-xl font-bold text-primary-600">৳{state.amount?.toLocaleString()}</p>
              </>
            )}
          </div>
        )}
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate("/dashboard/my-bookings")} className="btn-primary">
            View My Bookings
          </button>
          <button onClick={() => navigate("/")} className="btn-outline flex items-center justify-center gap-2">
            <FiHome /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

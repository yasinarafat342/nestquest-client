import { motion } from "framer-motion";
import { FiHome } from "react-icons/fi";

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 to-primary-900 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 text-white font-display font-bold text-3xl">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          >
            <FiHome className="text-primary-400 text-4xl" />
          </motion.div>
          Nest<span className="text-primary-400">Quest</span>
        </div>

        {/* Animated dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-primary-400 rounded-full"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>

        <p className="text-primary-200 text-sm">Loading your experience...</p>
      </motion.div>
    </div>
  );
}

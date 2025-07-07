import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center px-6">
      {/* Floating Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-10 left-10"></div>
        <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-40 right-20"></div>
        <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-10 left-40"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 bg-white/10 dark:bg-white/10 backdrop-blur-2xl shadow-xl p-12 rounded-3xl text-center space-y-6 max-w-lg w-full border border-gray-700"
      >
        <h1 className="text-5xl font-extrabold text-gray-100 drop-shadow">
          ☁️ Welcome to <span className="text-indigo-400">MyCloudBox</span>
        </h1>
        <p className="text-lg text-gray-300">
          Securely upload, organize, and share your files from anywhere.
          Start now by logging in or creating an account.
        </p>

        <div className="flex gap-4 justify-center">
          <Link to="/login">
            <Button
              variant="default"
              className="px-8 py-3 text-base bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl"
            >
              Login
            </Button>
          </Link>
          <Link to="/register">
            <Button
              variant="secondary"
              className="px-8 py-3 text-base border border-indigo-400 text-indigo-400 hover:bg-indigo-500/10 font-semibold rounded-xl"
            >
              Register
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200 relative">
      {/* Blurred Blobs */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-10 left-10" />
        <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-40 right-20" />
        <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-10 left-40" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 pb-24 text-center px-6 md:px-20">
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-extrabold text-indigo-400 drop-shadow mb-6"
        >
          Welcome to MyCloudBox
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
        >
          Your privacy-first cloud storage to upload, organize, and share files—beautifully.
        </motion.p>

        {/* Terminal-style Simulation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="bg-gray-800/60 border border-gray-700 rounded-xl text-left max-w-2xl mx-auto p-6 shadow-lg font-mono text-sm"
        >
          <p className="text-green-400">~$</p>
          <p className="text-indigo-400">📁 Uploading <span className="text-white">project.zip</span>...</p>
          <p className="text-indigo-400">✅ File uploaded securely to MyCloudBox</p>
          <p className="text-indigo-400">📂 Moved to folder <span className="text-white">/Work/ClientX</span></p>
          <p className="text-indigo-400">🔗 Shareable Link: <span className="text-white">https://mycloudbox.io/file/xyz</span></p>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 bg-gray-800 bg-opacity-50 py-20 px-6 md:px-20 border-t border-b border-gray-700">
        <h2 className="text-3xl font-bold text-indigo-400 text-center mb-12">Why Choose MyCloudBox?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl bg-gray-700/40 shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold mb-2">🔒 Secure Uploads</h3>
            <p className="text-gray-300 text-sm">
              Files are encrypted and stored in the cloud with zero-knowledge security.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl bg-gray-700/40 shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold mb-2">📁 Organized Storage</h3>
            <p className="text-gray-300 text-sm">
              Manage folders, rename files, and keep your cloud clean and structured.
            </p>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} className="p-6 rounded-xl bg-gray-700/40 shadow-md border border-gray-600">
            <h3 className="text-xl font-semibold mb-2">🔗 Easy Sharing</h3>
            <p className="text-gray-300 text-sm">
              One-click shareable links. No signup required for your recipients.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative z-10 py-20 text-center px-6 md:px-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-gray-800/80 border border-gray-700 p-10 rounded-3xl max-w-3xl mx-auto shadow-lg"
        >
          <h3 className="text-2xl font-semibold text-gray-100 mb-4">Start your cloud journey today 🚀</h3>
          <p className="text-gray-400 mb-6">
            Join thousands who trust MyCloudBox to manage their digital life.
          </p>
          <Link to={user ? "/dashboard" : "/register"}>
            <Button className="px-8 py-3 text-lg bg-indigo-600 hover:bg-indigo-700 rounded-xl">
              {user ? "Go to Dashboard" : "Get Started Free"}
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm py-6 text-gray-500 border-t border-gray-700 bg-gray-900/80 relative z-10">
        © {new Date().getFullYear()} MyCloudBox. Built with ❤️ and privacy-first principles.
      </footer>
    </div>
  );
}

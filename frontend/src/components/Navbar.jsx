import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 py-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center z-50 shadow-sm fixed top-0 left-0"
    >
      {/* Logo */}
      <Link to="/" className="text-indigo-400 text-xl font-bold tracking-wide">
        📦 MyCloudBox
      </Link>

      {/* Links */}
      <div className="flex items-center gap-4 text-gray-300 text-sm">
        {user && (
          <>
            <Link to="/" className="hover:text-indigo-400 transition">Home</Link>
            <Link to="/dashboard" className="hover:text-indigo-400 transition">Dashboard</Link>
            <Link to="/upload" className="hover:text-indigo-400 transition">Upload</Link>
          </>
        )}
      </div>

      {/* Auth Buttons */}
      <div className="flex items-center gap-3">
        {user ? (
          <Button variant="destructive" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <>
            <Link to="/login">
              <Button size="sm" variant="outline" className="text-gray-300 border-gray-600 hover:bg-gray-700">
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </motion.nav>
  );
}

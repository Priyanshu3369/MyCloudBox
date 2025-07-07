import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      login(res.data);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden px-4">
      {/* Background Blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob top-0 left-0"></div>
        <div className="absolute w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 top-40 right-0"></div>
        <div className="absolute w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 bottom-0 left-20"></div>
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-10"
      >
        <Card className="w-[400px] backdrop-blur-xl bg-gray-800/60 border border-gray-700 shadow-2xl rounded-2xl">
          <CardContent className="p-8 space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-100">
              🔐 Login to <span className="text-indigo-400">MyCloudBox</span>
            </h2>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="bg-gray-700/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />

              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                className="bg-gray-700/50 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
              />

              <Button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <Loader2 className="animate-spin h-4 w-4" />
                    <span>Logging in...</span>
                  </span>
                ) : (
                  'Login'
                )}
              </Button>
            </form>

            <div className="text-sm text-center text-gray-400 mt-4">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-indigo-400 font-semibold hover:underline"
              >
                Register
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

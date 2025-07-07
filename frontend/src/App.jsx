import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import Upload from './pages/Upload';
import NotFound from './pages/NotFound'; // Optional 404 page
import Navbar from './components/Navbar';
import { useAuth } from './context/AuthContext';

// 🔐 Protected Route Wrapper
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <>
      {/* ✅ Global Navigation */}
      <Navbar />

      {/* ✅ Offset content from navbar */}
      <div className="pt-16 min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-black">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/upload" element={
            <PrivateRoute>
              <Upload />
            </PrivateRoute>
          } />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}

export default App;

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleRestrictedAction = () => {
    if (!user) {
      alert('Please login to perform this action.');
      return;
    }

    // Perform your upload/delete/share logic here...
    console.log("Authorized action by user:", user.user.email);
  };

  const handleLogout = () => {
    logout();            // Clear user data
    navigate('/');       // Redirect to homepage
  };

  return (
    <div className="p-10 space-y-4">
      <h1 className="text-2xl font-bold mb-4">📁 MyCloudBox Dashboard</h1>

      {/* Welcome Message */}
      {user ? (
        <>
          <p>Welcome back, <span className="font-semibold">{user.user.name}</span>!</p>
          <p>Email: {user.user.email}</p>
          <button
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600">You are not logged in.</p>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/login')}
          >
            Login
          </button>
        </>
      )}

      <hr className="my-6" />

      {/* Action Buttons - Conditional */}
      <div className="space-x-4">
        <button
          onClick={handleRestrictedAction}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Upload File
        </button>
        <button
          onClick={handleRestrictedAction}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Delete File
        </button>
        <button
          onClick={handleRestrictedAction}
          className="bg-purple-500 text-white px-4 py-2 rounded"
        >
          Share File
        </button>
        {user && (
          <button
            className="bg-indigo-600 text-white px-4 py-2 rounded"
            onClick={() => navigate('/upload')}
          >
            Go to Upload Page
          </button>
        )}
      </div>
    </div>
  );
}

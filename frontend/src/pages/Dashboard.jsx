import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);

  // 🧠 Fetch uploaded files
  useEffect(() => {
    if (!user) return;

    const fetchFiles = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/files/my-files', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        setFiles(res.data);
      } catch (err) {
        console.error("Failed to fetch files:", err);
      }
    };

    fetchFiles();
  }, [user]);

  // 🗑️ Delete file
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this file?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });


      setFiles(prev => prev.filter(file => file._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete file.");
    }
  };

  // 🚫 Block upload/share/delete if not logged in
  const handleRestrictedAction = () => {
    if (!user) {
      alert('Please login to perform this action.');
      return;
    }

    console.log("Authorized action by user:", user.user.email);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-10 space-y-6">
      <h1 className="text-2xl font-bold">📁 MyCloudBox Dashboard</h1>

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

      <hr />

      {/* Action Buttons */}
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

      {/* Uploaded Files List */}
      {user && (
        <div className="mt-10 space-y-4">
          <h2 className="text-xl font-semibold">📄 Your Uploaded Files:</h2>
          {files.length === 0 ? (
            <p className="text-gray-500">No files uploaded yet.</p>
          ) : (
            <div className="grid gap-4">
              {files.map(file => (
                <div key={file._id} className="p-4 border rounded bg-gray-50 shadow-sm">
                  <p><strong>Name:</strong> {file.name}</p>
                  <p><strong>Type:</strong> {file.format}</p>
                  <p><strong>Uploaded:</strong> {new Date(file.createdAt).toLocaleString()}</p>
                  <p>
                    <strong>Download:</strong>{" "}
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Open
                    </a>
                  </p>
                  <button
                    onClick={() => handleDelete(file._id)}
                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

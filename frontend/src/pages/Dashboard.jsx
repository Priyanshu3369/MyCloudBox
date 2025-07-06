import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');

  // 🧠 Fetch files and folders
  useEffect(() => {
    if (!user) return;

    const fetchAll = async () => {
      try {
        const [filesRes, foldersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/files/my-files', {
            headers: { Authorization: `Bearer ${user.token}` }
          }),
          axios.get('http://localhost:5000/api/folders/my-folders', {
            headers: { Authorization: `Bearer ${user.token}` }
          })
        ]);
        setFiles(filesRes.data);
        setFolders(foldersRes.data);
      } catch (err) {
        console.error("Fetching error:", err);
      }
    };

    fetchAll();
  }, [user]);

  // ➕ Create folder
  const createFolder = async () => {
    if (!folderName.trim()) return alert("Please enter a folder name.");
    try {
      const res = await axios.post('http://localhost:5000/api/folders/create',
        { name: folderName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFolders(prev => [res.data, ...prev]);
      setFolderName('');
    } catch (err) {
      console.error("Create folder failed:", err);
    }
  };

  // 🗑️ Delete file
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
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

  // 🔗 Copy shareable link
  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert("Shareable link copied to clipboard!");
  };

  // 📂 Filter by folder
  const handleFolderClick = async (folderId) => {
    setActiveFolder(folderId || 'all');
    if (folderId === 'all') {
      const res = await axios.get('http://localhost:5000/api/files/my-files', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFiles(res.data);
    } else {
      const res = await axios.get(`http://localhost:5000/api/files/folder/${folderId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setFiles(res.data);
    }
  };

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
    <div className="p-10 space-y-8">
      <h1 className="text-2xl font-bold">📁 MyCloudBox Dashboard</h1>

      {/* 👋 Welcome Message */}
      {user ? (
        <>
          <p>Welcome back, <span className="font-semibold">{user.user.name}</span>!</p>
          <p>Email: {user.user.email}</p>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </>
      ) : (
        <>
          <p className="text-gray-600">You are not logged in.</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded">
            Login
          </button>
        </>
      )}

      <hr />

      {/* 🚀 Actions */}
      <div className="space-x-4">
        <button onClick={handleRestrictedAction} className="bg-green-500 text-white px-4 py-2 rounded">
          Upload File
        </button>
        <button onClick={handleRestrictedAction} className="bg-yellow-500 text-white px-4 py-2 rounded">
          Delete File
        </button>
        <button onClick={handleRestrictedAction} className="bg-purple-500 text-white px-4 py-2 rounded">
          Share File
        </button>
        {user && (
          <button onClick={() => navigate('/upload')} className="bg-indigo-600 text-white px-4 py-2 rounded">
            Go to Upload Page
          </button>
        )}
      </div>

      {/* 📁 Folder Section */}
      {user && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">📂 Your Folders</h2>

          {/* Folder Creation */}
          <div className="flex gap-2">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Enter folder name"
              className="border px-3 py-2 rounded w-64"
            />
            <button onClick={createFolder} className="bg-green-600 text-white px-4 py-2 rounded">
              + Create
            </button>
          </div>

          {/* Folder List */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => handleFolderClick('all')}
              className={`px-3 py-2 border rounded ${activeFolder === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              📁 All Files
            </button>
            {folders.map(folder => (
              <button
                key={folder._id}
                onClick={() => handleFolderClick(folder._id)}
                className={`px-3 py-2 border rounded ${activeFolder === folder._id ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
              >
                📁 {folder.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 📄 Files */}
      {user && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">📄 Files in {activeFolder === 'all' ? "All Folders" : "Selected Folder"}:</h2>
          {files.length === 0 ? (
            <p className="text-gray-500">No files to show.</p>
          ) : (
            <div className="grid gap-4">
              {files.map(file => (
                <div key={file._id} className="p-4 border rounded bg-gray-50 shadow-sm">
                  <p><strong>Name:</strong> {file.name}</p>
                  <p><strong>Type:</strong> {file.format}</p>
                  <p><strong>Uploaded:</strong> {new Date(file.createdAt).toLocaleString()}</p>
                  <p>
                    <strong>Download:</strong>{" "}
                    <a href={file.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">
                      Open
                    </a>
                  </p>
                  <div className="flex gap-3 mt-2">
                    <button
                      onClick={() => handleShare(file.url)}
                      className="bg-purple-500 text-white px-3 py-1 rounded"
                    >
                      Share Link
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

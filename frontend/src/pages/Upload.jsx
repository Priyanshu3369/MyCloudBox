import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const navigate = useNavigate();

  // 📁 Fetch user's folders for dropdown
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/folders/my-folders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setFolders(res.data);
      } catch (err) {
        console.error("Failed to fetch folders:", err);
      }
    };

    if (user) fetchFolders();
  }, [user]);

  // 📤 Handle Upload
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to upload files.");
      navigate('/login');
      return;
    }

    if (!file) {
      alert("Please choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (selectedFolder) formData.append('folderId', selectedFolder);

    try {
      const res = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploaded(res.data);
    } catch (err) {
      console.error("Upload error:", err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">📤 Upload a File</h1>

      <form onSubmit={handleUpload} className="space-y-4 w-[350px]">
        {/* File Input */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block border p-2 rounded w-full"
        />

        {/* Folder Dropdown */}
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="block border p-2 rounded w-full"
        >
          <option value="">Select folder (optional)</option>
          {folders.map(folder => (
            <option key={folder._id} value={folder._id}>
              📁 {folder.name}
            </option>
          ))}
        </select>

        {/* Upload Button */}
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded w-full">
          Upload
        </button>
      </form>

      {/* Uploaded Result */}
      {uploaded && (
        <div className="mt-6 p-4 border rounded shadow w-[400px] bg-gray-100">
          <h2 className="font-semibold text-lg">✅ File Uploaded!</h2>
          <p><strong>Name:</strong> {uploaded.name}</p>
          <p><strong>Type:</strong> {uploaded.format}</p>
          <p>
            <strong>Download:</strong>{" "}
            <a href={uploaded.url} className="text-blue-600 underline" target="_blank" rel="noreferrer">
              Click to open
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

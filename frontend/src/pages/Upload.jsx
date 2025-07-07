import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const dropRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/folders/my-folders', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFolders(res.data);
      } catch (err) {
        console.error('Failed to fetch folders:', err);
      }
    };

    if (user) fetchFolders();
  }, [user]);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to upload files.');
      navigate('/login');
      return;
    }

    if (!file) {
      toast.error('Please choose or drag a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    if (selectedFolder) formData.append('folderId', selectedFolder);

    try {
      const res = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percent);
        },
      });
      setUploaded(res.data);
      toast.success('File uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      toast.success(`📂 File "${droppedFile.name}" ready to upload`);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  return (
    <div className="min-h-screen px-4 py-12 flex flex-col items-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-extrabold text-white mb-6 text-center">📤 Upload a File</h1>

      <form
        onSubmit={handleUpload}
        className="w-full max-w-md p-8 rounded-2xl shadow-xl backdrop-blur-lg bg-white/10 border border-gray-700 space-y-6"
      >
        {/* Drag & Drop Box */}
        <div
          ref={dropRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="w-full border-2 border-dashed border-gray-600 p-8 rounded-xl text-center cursor-pointer text-gray-200 hover:bg-gray-700/30 transition-colors"
        >
          {file ? (
            <p className="text-lg font-semibold">📎 {file.name}</p>
          ) : (
            <p className="text-gray-400">Drag & drop your file here or choose below</p>
          )}
        </div>

        {/* File Input */}
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100"
        />

        {/* Folder Selection */}
        <select
          value={selectedFolder}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="block w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100"
        >
          <option value="">📁 Select folder (optional)</option>
          {folders.map((folder) => (
            <option key={folder._id} value={folder._id}>
              📁 {folder.name}
            </option>
          ))}
        </select>

        {/* Progress Bar */}
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              style={{ width: `${uploadProgress}%` }}
              className="bg-green-500 h-full transition-all duration-200"
            ></div>
          </div>
        )}

        {/* Upload Button */}
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-colors"
        >
          Upload
        </button>
      </form>

      {/* Upload Success Info */}
      {uploaded && (
        <div className="mt-8 p-6 rounded-2xl shadow-xl backdrop-blur-lg bg-white/10 border border-gray-700 w-full max-w-md text-gray-100">
          <h2 className="text-xl font-bold mb-2">✅ File Uploaded!</h2>
          <p><strong>Name:</strong> {uploaded.name}</p>
          <p><strong>Type:</strong> {uploaded.format}</p>
          <p className="mt-2">
            <strong>Download:</strong>{' '}
            <a
              href={uploaded.url}
              className="text-blue-400 underline"
              target="_blank"
              rel="noreferrer"
            >
              Click to open
            </a>
          </p>
        </div>
      )}
    </div>
  );
}

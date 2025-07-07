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
  const [customName, setCustomName] = useState('');
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

  // ✅ Supported MIME check
  const isSupportedFormat = (file) => {
    const supportedTypes = ['image/', 'video/'];
    return supportedTypes.some((type) => file.type.startsWith(type));
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please login to upload files.');
      navigate('/login');
      return;
    }

    if (!file || !customName) {
      toast.error('Please choose a file and enter a custom name.');
      return;
    }

    if (!isSupportedFormat(file)) {
      toast.error('❌ Unsupported file format. Only images and videos are allowed.');
      return;
    }

    const fileExt = file.name.split('.').pop();
    const renamedFile = new File([file], `${customName}.${fileExt}`, { type: file.type });

    const formData = new FormData();
    formData.append('file', renamedFile);
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
      toast.success('✅ File uploaded successfully!');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Upload failed.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];

    if (!droppedFile) return;

    if (!isSupportedFormat(droppedFile)) {
      toast.error('❌ Unsupported file format. Only images and videos are allowed.');
      return;
    }

    setFile(droppedFile);
    const defaultName = droppedFile.name.split('.').slice(0, -1).join('.');
    setCustomName(defaultName);
    toast.success(`📂 File "${droppedFile.name}" ready to upload`);
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
          accept="image/*,video/*"
          onChange={(e) => {
            const selected = e.target.files[0];
            if (!selected) return;

            if (!isSupportedFormat(selected)) {
              toast.error('❌ Unsupported file format. Only images and videos are allowed.');
              return;
            }

            setFile(selected);
            setCustomName(selected.name.split('.').slice(0, -1).join('.'));
          }}
          className="block w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100"
        />

        {/* Custom Name Input */}
        {file && (
          <input
            type="text"
            placeholder="Enter custom file name"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            className="block w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-gray-100"
            required
          />
        )}

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

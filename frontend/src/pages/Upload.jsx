import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(null);
  const navigate = useNavigate();

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

    try {
      const res = await axios.post('http://localhost:5000/api/files/upload', formData, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setUploaded(res.data);
    } catch (err) {
      console.error(err);
      alert("Upload failed.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">📤 Upload a File</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="block border p-2 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>

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

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PublicView() {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/files/public/${id}`);
        setFile(res.data);
      } catch (err) {
        console.error(err);
        setError('File not found or something went wrong.');
      }
    };
    fetchFile();
  }, [id]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {error ? (
        <div className="text-red-500 font-semibold">{error}</div>
      ) : file ? (
        <div className="max-w-lg w-full p-6 rounded border shadow bg-white space-y-4">
          <h1 className="text-2xl font-bold">📂 Public File</h1>
          <p><strong>Name:</strong> {file.name}</p>
          <p><strong>Type:</strong> {file.format}</p>
          <p><strong>Uploaded:</strong> {new Date(file.createdAt).toLocaleString()}</p>
          <a
            href={file.url}
            target="_blank"
            rel="noreferrer"
            className="block bg-blue-600 text-white text-center py-2 rounded"
          >
            🔗 Open File
          </a>
          <a
            href={file.url}
            download
            className="block bg-green-600 text-white text-center py-2 rounded"
          >
            ⬇️ Download File
          </a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

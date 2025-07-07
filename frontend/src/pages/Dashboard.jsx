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
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch files based on folder
  const fetchFiles = async (folderId = null) => {
    try {
      const url = folderId
        ? `http://localhost:5000/api/files/folder/${folderId}`
        : `http://localhost:5000/api/files/my-files`;
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFiles(res.data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };

  // Fetch folders
  const fetchFolders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/folders/my-folders', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFolders(res.data);
    } catch (err) {
      console.error("Error fetching folders:", err);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchFiles();
    fetchFolders();
  }, [user]);

  // Create a new folder
  const createFolder = async () => {
    if (!folderName.trim()) return alert("Please enter a folder name.");
    try {
      const res = await axios.post(
        'http://localhost:5000/api/folders/create',
        { name: folderName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFolders(prev => [res.data, ...prev]);
      setFolderName('');
    } catch (err) {
      console.error("Folder creation failed:", err);
    }
  };

  // Rename folder via prompt
  const handleRenameFolder = async (folder) => {
    const newName = prompt("Enter new folder name:", folder.name);
    if (!newName || newName.trim() === folder.name) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/folders/rename/${folder._id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Update local folder list
      setFolders((prev) =>
        prev.map((f) => (f._id === folder._id ? res.data.folder : f))
      );
    } catch (err) {
      console.error("Failed to rename folder:", err);
      alert("Rename failed.");
    }
  };

  // Delete folder with confirmation and cascade option
  const handleDeleteFolder = async (folder) => {
    const confirmDelete = window.confirm(
      `Delete folder "${folder.name}"?\nPress OK to also delete all files in the folder,\nor Cancel to keep the files (removing folder association).`
    );
    try {
      // If confirmed, set query param deleteFiles=true; otherwise, false.
      const deleteFiles = confirmDelete ? 'true' : 'false';
      await axios.delete(
        `http://localhost:5000/api/folders/${folder._id}?deleteFiles=${deleteFiles}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      // Remove folder from local list and refresh file list if needed.
      setFolders((prev) => prev.filter((f) => f._id !== folder._id));
      if (activeFolder === folder._id) {
        setActiveFolder('all');
        fetchFiles();
      }
    } catch (err) {
      console.error("Failed to delete folder:", err);
      alert("Folder deletion failed.");
    }
  };

  // Move file into folder
  const handleMoveFile = async (fileId, folderId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/files/move/${fileId}`,
        { folderId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFiles((prev) =>
        prev.map((f) => (f._id === fileId ? res.data : f))
      );
    } catch (err) {
      console.error("Failed to move file:", err);
    }
  };

  // Delete file
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFiles((prev) => prev.filter((file) => file._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete file.");
    }
  };

  // Share link
  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert("🔗 Link copied to clipboard!");
  };

  // Filter files by folder
  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId || 'all');
    fetchFiles(folderId === 'all' ? null : folderId);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Helper: Get file icon (for thumbnails)
  const getFileIcon = (format) => {
    const type = format.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return '🖼️';
    if (['mp4', 'mov', 'avi', 'webm'].includes(type)) return '🎞️';
    if (['pdf'].includes(type)) return '📄';
    if (['doc', 'docx'].includes(type)) return '📝';
    if (['zip', 'rar'].includes(type)) return '📦';
    return '📁';
  };

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-2xl font-bold">📁 MyCloudBox Dashboard</h1>

      {/* Welcome Section */}
      {user ? (
        <>
          <p>Welcome back, <strong>{user.user.name}</strong></p>
          <p>Email: {user.user.email}</p>
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded">
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded">
          Login
        </button>
      )}

      <hr />

      {/* Action Buttons */}
      <div className="space-x-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => navigate('/upload')}>
          Upload Page
        </button>
      </div>

      {/* Folder Section */}
      {user && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">📂 Folders</h2>

          {/* Create Folder */}
          <div className="flex gap-2">
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              className="border px-3 py-2 rounded w-64"
              placeholder="New folder name"
            />
            <button onClick={createFolder} className="bg-green-600 text-white px-4 py-2 rounded">
              + Create
            </button>
          </div>

          {/* Folder List with Rename/Delete Options */}
          <div className="flex flex-wrap gap-2 mt-3">
            <button
              onClick={() => handleFolderClick('all')}
              className={`px-3 py-2 border rounded ${activeFolder === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              📁 All Files
            </button>
            {folders.map((folder) => (
              <div key={folder._id} className="flex items-center gap-1 bg-gray-200 px-2 py-1 rounded">
                <button
                  onClick={() => handleFolderClick(folder._id)}
                  className={`px-2 py-1 rounded ${activeFolder === folder._id ? 'bg-blue-600 text-white' : ''}`}
                >
                  📁 {folder.name}
                </button>
                <button
                  onClick={() => handleRenameFolder(folder)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Rename
                </button>
                <button
                  onClick={() => handleDeleteFolder(folder)}
                  className="text-sm text-red-600 hover:underline"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      {user && (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            📄 Files in {activeFolder === 'all' ? "All Folders" : "Selected Folder"}
          </h2>

          <div className="my-4">
            <input
              type="text"
              placeholder="🔍 Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-1/2 px-4 py-2 border rounded shadow"
            />
          </div>

          {files.length === 0 ? (
            <p className="text-gray-500">No files uploaded.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {files
                .filter((file) =>
                  file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  file.format.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((file) => (
                  <div key={file._id} className="border rounded-lg p-4 bg-gray-50 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{getFileIcon(file.format)}</span>
                      <div>
                        <p className="font-semibold">{file.name}</p>
                        <p className="text-sm text-gray-600">{file.format.toUpperCase()}</p>
                        <p className="text-xs text-gray-400">{new Date(file.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Open
                      </a>
                      <button
                        onClick={() => handleShare(file.url)}
                        className="bg-purple-500 text-white px-3 py-1 rounded"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                      {/* Move file dropdown */}
                      <select
                        defaultValue={file.folder || ""}
                        onChange={(e) => handleMoveFile(file._id, e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        <option value="">No Folder</option>
                        {folders.map((folder) => (
                          <option key={folder._id} value={folder._id}>
                            Move to ➜ {folder.name}
                          </option>
                        ))}
                      </select>
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

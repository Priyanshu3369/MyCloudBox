import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderName, setFolderName] = useState('');
  const [activeFolder, setActiveFolder] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const createFolder = async () => {
    if (!folderName.trim()) return toast.error("Please enter a folder name.");
    try {
      const res = await axios.post(
        'http://localhost:5000/api/folders/create',
        { name: folderName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFolders(prev => [res.data, ...prev]);
      setFolderName('');
      toast.success("Folder created successfully");
    } catch (err) {
      console.error("Folder creation failed:", err);
      toast.error("Failed to create folder");
    }
  };

  const handleRenameFolder = async (folder) => {
    const newName = prompt("Enter new folder name:", folder.name);
    if (!newName || newName.trim() === folder.name) return;
    try {
      const res = await axios.put(
        `http://localhost:5000/api/folders/rename/${folder._id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFolders((prev) =>
        prev.map((f) => (f._id === folder._id ? res.data.folder : f))
      );
      toast.success("Folder renamed successfully");
    } catch (err) {
      console.error("Failed to rename folder:", err);
      toast.error("Rename failed.");
    }
  };

  const handleDeleteFolder = async (folder) => {
    const confirmDelete = window.confirm(
      `Delete folder "${folder.name}"?\nPress OK to also delete all files in the folder,\nor Cancel to keep the files.`
    );
    try {
      const deleteFiles = confirmDelete ? 'true' : 'false';
      await axios.delete(
        `http://localhost:5000/api/folders/${folder._id}?deleteFiles=${deleteFiles}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFolders((prev) => prev.filter((f) => f._id !== folder._id));
      if (activeFolder === folder._id) {
        setActiveFolder('all');
        fetchFiles();
      }
      toast.success("Folder deleted successfully");
    } catch (err) {
      console.error("Failed to delete folder:", err);
      toast.error("Folder deletion failed.");
    }
  };

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
      toast.success("File moved");
    } catch (err) {
      console.error("Failed to move file:", err);
      toast.error("Failed to move file");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/files/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setFiles((prev) => prev.filter((file) => file._id !== id));
      toast.success("File deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete file");
    }
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("🔗 Link copied to clipboard!");
  };

  const handleFolderClick = (folderId) => {
    setActiveFolder(folderId || 'all');
    fetchFiles(folderId === 'all' ? null : folderId);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {/* Sidebar */}
      <aside className="w-full md:w-64 backdrop-blur bg-gray-800/80 border-r border-gray-700 p-6 space-y-4 shadow-md">
        <h2 className="text-lg font-semibold mb-2 text-indigo-400">📁 Folders</h2>
        <Button
          size="sm"
          variant={activeFolder === 'all' ? 'default' : 'ghost'}
          onClick={() => handleFolderClick('all')}
          className="w-full justify-start text-gray-200"
        >
          📂 All Files
        </Button>
        {folders.map(folder => (
          <div key={folder._id} className="flex items-center justify-between bg-gray-700 rounded-lg px-3 py-2 shadow hover:shadow-md transition">
            <Button
              size="sm"
              variant={activeFolder === folder._id ? 'default' : 'ghost'}
              onClick={() => handleFolderClick(folder._id)}
              className="justify-start text-gray-200"
            >
              📂 {folder.name}
            </Button>
            <div className="flex gap-2 text-xs">
              <button onClick={() => handleRenameFolder(folder)} className="text-blue-400 hover:underline">Rename</button>
              <button onClick={() => handleDeleteFolder(folder)} className="text-red-400 hover:underline">Delete</button>
            </div>
          </div>
        ))}
        <Input
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="New folder name"
          className="mt-4 bg-gray-700 text-gray-200 placeholder-gray-400"
        />
        <Button size="sm" onClick={createFolder} className="w-full bg-indigo-600 hover:bg-indigo-700">
          + Create Folder
        </Button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 space-y-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-indigo-400">MyCloudBox</h1>
              <p className="text-sm text-gray-300">Hello, <strong>{user?.user?.name}</strong></p>
              <p className="text-xs text-gray-500">{user?.user?.email}</p>
            </div>
            <Button variant="destructive" onClick={handleLogout}>Logout</Button>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <Input
            type="text"
            placeholder="🔍 Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-1/2 bg-gray-700 text-gray-200 placeholder-gray-400"
          />
          <Button onClick={() => navigate('/upload')} className="bg-green-600 hover:bg-green-700">
            + Upload File
          </Button>
        </div>

        {files.length === 0 ? (
          <p className="text-gray-400">No files uploaded yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {files
              .filter((file) =>
                file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                file.format.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((file) => (
                <motion.div
                  key={file._id}
                  className="border border-gray-700 rounded-2xl p-6 bg-gray-800 shadow hover:shadow-lg transition"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{getFileIcon(file.format)}</span>
                    <div>
                      <p className="font-semibold text-gray-200">{file.name}</p>
                      <p className="text-sm text-gray-400">{file.format.toUpperCase()}</p>
                      <p className="text-xs text-gray-500">{new Date(file.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Open
                    </a>
                    <button
                      onClick={() => handleShare(file.url)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Share
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Delete
                    </button>
                    <select
                      defaultValue={file.folder || ""}
                      onChange={(e) => handleMoveFile(file._id, e.target.value)}
                      className="bg-gray-700 text-gray-200 border px-2 py-1 rounded-full text-sm"
                    >
                      <option value="">No Folder</option>
                      {folders.map((folder) => (
                        <option key={folder._id} value={folder._id}>
                          ➜ {folder.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

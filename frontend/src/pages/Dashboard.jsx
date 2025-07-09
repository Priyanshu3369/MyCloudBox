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
      toast.success("📁 Folder created successfully");
    } catch (err) {
      console.error("Folder creation failed:", err);
      toast.error("Failed to create folder");
    }
  };

  const handleRenameFolder = async (folder) => {
    const newName = prompt("✏️ Enter new folder name:", folder.name);
    if (!newName || newName.trim() === folder.name) return toast.warning("Rename cancelled.");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/folders/rename/${folder._id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFolders((prev) =>
        prev.map((f) => (f._id === folder._id ? res.data.folder : f))
      );
      toast.success("✅ Folder renamed successfully");
    } catch (err) {
      console.error("Rename failed:", err);
      toast.error("Failed to rename folder");
    }
  };

  const handleDeleteFolder = async (folder) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          const deleteFiles = true;
          await axios.delete(
            `http://localhost:5000/api/folders/${folder._id}?deleteFiles=${deleteFiles}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          setFolders((prev) => prev.filter((f) => f._id !== folder._id));
          if (activeFolder === folder._id) {
            setActiveFolder('all');
            fetchFiles();
          }
          resolve();
        } catch (err) {
          reject();
        }
      }),
      {
        loading: `Deleting folder "${folder.name}"...`,
        success: `Folder "${folder.name}" deleted successfully.`,
        error: `Failed to delete folder.`,
      }
    );
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
      toast.success("📦 File moved successfully");
    } catch (err) {
      console.error("Move failed:", err);
      toast.error("Failed to move file");
    }
  };

  const handleDelete = async (id) => {
    toast.promise(
      new Promise(async (resolve, reject) => {
        try {
          await axios.delete(`http://localhost:5000/api/files/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setFiles((prev) => prev.filter((file) => file._id !== id));
          resolve();
        } catch (err) {
          reject();
        }
      }),
      {
        loading: "Deleting file...",
        success: "🗑️ File deleted successfully",
        error: "Failed to delete file",
      }
    );
  };

  const handleRenameFile = async (file) => {
    const newName = prompt("✏️ Enter new file name (without extension):", file.name);
    if (!newName || newName.trim() === file.name) return toast.warning("Rename cancelled.");
    try {
      const res = await axios.put(
        `http://localhost:5000/api/files/rename/${file._id}`,
        { name: newName },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setFiles((prev) =>
        prev.map((f) => (f._id === file._id ? res.data.file : f))
      );
      toast.success("✅ File renamed successfully");
    } catch (err) {
      console.error("Rename failed:", err);
      toast.error("Failed to rename file");
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
    const type = (format || '').toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type)) return '🖼️';
    if (['mp4', 'mov', 'avi', 'webm'].includes(type)) return '🎞️';
    if (['pdf'].includes(type)) return '📄';
    if (['doc', 'docx'].includes(type)) return '📝';
    if (['zip', 'rar', '7z'].includes(type)) return '📦';
    if (['txt'].includes(type)) return '📑';
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
            </div>
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
                      <p className="text-sm text-gray-400">{(file.format || 'unknown').toUpperCase()}</p>
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
                      onClick={() => handleRenameFile(file)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Rename
                    </button>
                    <button
                      onClick={() => handleDelete(file._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </main>
    </div>
  );
}

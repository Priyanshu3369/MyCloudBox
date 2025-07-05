import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-6">
      <h1 className="text-3xl font-bold">Welcome to MyCloudBox ☁️</h1>
      <div className="space-x-4">
        <Link to="/login">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
        </Link>
        <Link to="/register">
          <button className="bg-green-600 text-white px-4 py-2 rounded">Register</button>
        </Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post('http://localhost:5000/api/auth/register', form);
    login(res.data);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="p-6 bg-white rounded shadow-md space-y-4 w-96">
        <h2 className="text-xl font-bold">Register</h2>
        <input className="w-full p-2 border" placeholder="Name" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="w-full p-2 border" placeholder="Email" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full p-2 border" placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Register</button>
      </form>
    </div>
  );
}

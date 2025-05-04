import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

function AdminRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/register', {
        ...formData,
        role: 'admin' // Assign admin role
      });

      alert('Admin registration successful');
      navigate('/admin-login');
    } catch (error) {
      console.error('Admin registration failed:', error);
      alert(error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>

      <p className="text-sm mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <span
          className="text-blue-600 hover:underline cursor-pointer"
          onClick={() => navigate('/admin-login')}
        >
          Login
        </span>
      </p>
    </div>
  );
}

export default AdminRegister;

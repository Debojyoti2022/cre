import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("Registration successful");
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          name="name"
          className="mb-2 p-2 border w-full"
          type="text"
          placeholder="Name"
          onChange={handleChange}
          required
        />
        <input
          name="email"
          className="mb-2 p-2 border w-full"
          type="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />
        <input
          name="password"
          className="mb-2 p-2 border w-full"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />
        <button className="bg-green-500 text-white px-4 py-2 rounded w-full">Register</button>
        <p className="text-sm mt-4 text-center text-gray-600">
  Already have an account?{" "}
  <a
    href="/login"
    className="text-blue-500 hover:underline"
  >
    Login
  </a>
</p>
      </form>
    </div>
  );
}

export default Register;

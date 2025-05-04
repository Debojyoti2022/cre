import React, { useState } from 'react';
import axios from 'axios';

const Profile = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleUpdate = async () => {
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    try {
      setError('');
      const token = localStorage.getItem('token');
      const res = await axios.put(
        'http://localhost:5000/api/profile',
        { name },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage(res.data.message);
    } catch (err) {
      setMessage('');
      setError(err.response?.data?.error || 'Error updating profile');
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Profile</h2>
      <input
        type="text"
        className="border p-2 w-full mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Update
      </button>
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default Profile;

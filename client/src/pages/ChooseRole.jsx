// ChooseRole.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-semibold mb-8">Continue As</h1>
      <div className="flex gap-8">
        <button
          onClick={() => navigate('/register')}
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          User
        </button>
        <button
          onClick={() => navigate('/admin-register')}
          className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Admin
        </button>
      </div>
    </div>
  );
};

export default ChooseRole;

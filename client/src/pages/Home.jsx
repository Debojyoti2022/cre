import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Creator Dashboard</h1>
      <p className="text-gray-600 mb-6">
        Manage your profile, earn credits, and explore content from Reddit and LinkedIn.
      </p>
      <button
        onClick={() => navigate('/choose-role')}
        className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
      >
        Get Started
      </button>
    </div>
  );
}

export default Home;

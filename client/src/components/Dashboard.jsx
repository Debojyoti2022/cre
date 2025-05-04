import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Medal } from 'lucide-react'; // Make sure this is installed

const Dashboard = () => {
  const [data, setData] = useState({
    credits: 0,
    savedFeeds: [],
    recentActivity: [],
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get('/api/users/dashboard', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setData(res.data);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Credit Stats */}
      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-xl rounded-2xl p-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Your Credits</h2>
          <p className="text-4xl font-semibold">{data.credits}</p>
        </div>
        <Medal size={48} strokeWidth={2.5} className="text-yellow-300" />
      </div>

      {/* Saved Feeds */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Saved Feeds</h2>
        {data.savedFeeds.length === 0 ? (
          <p className="text-gray-500">No saved posts yet.</p>
        ) : (
          <ul className="space-y-2">
            {data.savedFeeds.map((post, idx) => (
              <li key={idx} className="border-b py-2">
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {post.title}
                </a>
                <p className="text-sm text-gray-500">{post.source}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
        {data.recentActivity.length === 0 ? (
          <p className="text-gray-500">No recent activity.</p>
        ) : (
          <ul className="space-y-1 list-disc list-inside text-sm text-gray-700">
            {data.recentActivity.map((activity, idx) => (
              <li key={idx}>{activity}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

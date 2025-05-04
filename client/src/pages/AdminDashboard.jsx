import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found. Redirecting to login...');
          setTimeout(() => navigate('/login'), 1500);
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        // Parallel requests
        const [usersRes, analyticsRes] = await Promise.all([
          axios.get('/api/admin/users', config),
          axios.get('/api/admin/analytics', config),
        ]);

        setUsers(usersRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error('Error fetching admin data:', err);
        const status = err.response?.status;
        if (status === 403) {
          setError('Forbidden: Insufficient role. Required role: admin');
        } else if (status === 401) {
          setError('Unauthorized: Please log in again.');
          setTimeout(() => navigate('/login'), 2000);
        } else {
          setError(err.response?.data?.error || 'Failed to fetch admin data.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl">Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <h2 className="text-xl">{error}</h2>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">User Analytics</h2>
        <p>Total Users: {analytics?.totalUsers || 0}</p>
        <p>Total Credits: {analytics?.totalCredits || 0}</p>
        <p>Total Saved Posts: {analytics?.totalSavedPosts || 0}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-2">All Users</h2>
        <ul>
          {users.length === 0 ? (
            <li>No users found</li>
          ) : (
            users.map((user) => (
              <li key={user._id} className="mb-2">
                <span className="font-semibold">{user.email}</span> - Credits: {user.credits ?? 0}
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

export default AdminDashboard;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    const fetchData = async () => {
      try {
        const [userRes, reportRes] = await Promise.all([
          axios.get('/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/api/feed/reports', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(userRes.data);
        setReports(reportRes.data);
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleUpdateCredits = (userId, newCredits) => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/');

    axios
      .put(`/api/admin/update-credits/${userId}`, { credits: newCredits }, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        setUsers(users.map(user => (user._id === userId ? res.data : user)));
      })
      .catch(() => alert('Error updating credits'));
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading...</div>;
  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* User Management */}
      <div className="mb-10">
        <h3 className="text-xl font-semibold mb-3">User Management</h3>
        <table className="min-w-full bg-white border rounded-md shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Credits</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.role}</td>
                <td className="p-3">
                  <input
                    type="number"
                    value={user.credits}
                    onChange={(e) => handleUpdateCredits(user._id, e.target.value)}
                    className="border p-1 rounded w-24"
                  />
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleUpdateCredits(user._id, user.credits)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Update Credits
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reported Feed Activity */}
      <div>
        <h3 className="text-xl font-semibold mb-3">Reported Feed Posts</h3>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reported posts yet.</p>
        ) : (
          <table className="min-w-full bg-white border rounded-md shadow">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Source</th>
                <th className="p-3 text-left">URL</th>
                <th className="p-3 text-left">Reported By</th>
                <th className="p-3 text-left">Time</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report._id} className="border-t">
                  <td className="p-3">{report.post.title}</td>
                  <td className="p-3">{report.post.source}</td>
                  <td className="p-3">
                    <a
                      href={report.post.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-500 underline"
                    >
                      View
                    </a>
                  </td>
                  <td className="p-3">{report.reportedBy?.email || 'Unknown'}</td>
                  <td className="p-3">{new Date(report.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Admin;

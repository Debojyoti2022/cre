import { useEffect, useState } from 'react';
import axios from 'axios';

function Feed() {
  const [redditPosts, setRedditPosts] = useState([]);
  const [linkedInPosts, setLinkedInPosts] = useState([]);

  useEffect(() => {
    fetchReddit();
    mockLinkedIn();
  }, []);

  const fetchReddit = async () => {
    try {
      const res = await axios.get('https://www.reddit.com/r/webdev/top.json?limit=5');
      const posts = res.data.data.children.map((child) => ({
        id: child.data.id,
        title: child.data.title,
        url: `https://reddit.com${child.data.permalink}`,
        source: 'Reddit',
        description: child.data.selftext || '', // Additional post text
        thumbnail: child.data.thumbnail && child.data.thumbnail.startsWith('http')
          ? child.data.thumbnail
          : null,
      }));
      setRedditPosts(posts);
    } catch (err) {
      console.error('Error fetching Reddit posts:', err);
    }
  };

  const mockLinkedIn = () => {
    const mock = [
      {
        id: 'li1',
        title: 'How to get hired as a Full Stack Developer',
        url: 'https://linkedin.com/jobs',
        source: 'LinkedIn',
        description: 'A detailed guide on landing a dev job using LinkedIn tools.',
      },
      {
        id: 'li2',
        title: 'LinkedIn launches AI resume builder',
        url: 'https://linkedin.com/news',
        source: 'LinkedIn',
        description: 'Now you can create resumes with the help of AI directly in LinkedIn.',
      },
    ];
    setLinkedInPosts(mock);
  };

  const handleSave = async (post) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/feed/save', post, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Saved post: ${post.title}`);
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to save post');
    }
  };

  const handleShare = (url) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleReport = async (post) => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/feed/report', post, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`Reported post: ${post.title}`);
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to report post');
    }
  };

  const posts = [...redditPosts, ...linkedInPosts];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">📢 Your Feed</h1>
      <div className="space-y-6 max-w-2xl mx-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-2xl shadow-md p-6 border border-gray-200"
          >
            {/* Clickable title */}
            <a
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-blue-700 hover:underline block"
            >
              {post.title}
            </a>

            <p className="text-sm text-gray-600 mb-3">Source: {post.source}</p>

            {/* Optional image preview */}
            {post.thumbnail && (
              <img
                src={post.thumbnail}
                alt="Post preview"
                className="w-full rounded mb-3"
              />
            )}

            {/* Post description */}
            {post.description && (
              <p className="text-gray-800 text-sm mb-4">{post.description}</p>
            )}

            <div className="flex justify-around pt-2 border-t mt-4 text-sm font-medium text-gray-600">
              <button
                onClick={() => handleSave(post)}
                className="hover:text-blue-600 transition flex items-center gap-1"
              >
                <i className="fas fa-bookmark"></i> Save
              </button>
              <button
                onClick={() => handleShare(post.url)}
                className="hover:text-green-600 transition flex items-center gap-1"
              >
                <i className="fas fa-share"></i> Share
              </button>
              <button
                onClick={() => handleReport(post)}
                className="hover:text-red-600 transition flex items-center gap-1"
              >
                <i className="fas fa-flag"></i> Report
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Feed;

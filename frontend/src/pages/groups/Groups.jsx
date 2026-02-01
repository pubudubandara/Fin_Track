import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { 
  PlusCircle, 
  Users, 
  UserPlus,
  DollarSign,
  Calendar
} from 'lucide-react';

const Groups = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchGroups();
    }
  }, [token]);

  const fetchGroups = async () => {
    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await fetch(`${API_BASE_URL}/api/groups`, { headers });
      const data = await response.json();
      setGroups(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching groups:", error);
      setLoading(false);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await fetch(`${API_BASE_URL}/api/groups`, {
        method: 'POST',
        headers,
        body: JSON.stringify(newGroup)
      });

      if (response.ok) {
        setShowCreateModal(false);
        setNewGroup({ name: '', description: '' });
        fetchGroups();
      }
    } catch (error) {
      console.error("Error creating group:", error);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">Groups</h2>
            <p className="text-neutral-500 text-sm mt-1">Manage your expense sharing groups</p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center transition"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Create Group
          </button>
        </header>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length > 0 ? (
            groups.map(group => (
              <div
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-full text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                    {group.members?.length || 0} members
                  </span>
                </div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">{group.name}</h3>
                <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                  {group.description || 'No description provided'}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex items-center text-neutral-500 text-sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>Total: LKR 0</span>
                  </div>
                  <span className="text-primary text-sm font-medium">
                    View Details →
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
              <div className="p-4 bg-neutral-100 rounded-full mb-4">
                <Users className="h-12 w-12 text-neutral-400" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-700 mb-2">No groups yet</h3>
              <p className="text-neutral-500 mb-6">Create a group to start sharing expenses with friends</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg flex items-center transition"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Create Your First Group
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Group Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">Create New Group</h3>
            <form onSubmit={handleCreateGroup}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Group Name
                </label>
                <input
                  type="text"
                  required
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., Weekend Trip"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="What's this group for?"
                  rows="3"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition"
                >
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;

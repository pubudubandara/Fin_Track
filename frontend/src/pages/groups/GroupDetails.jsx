import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import AddTransaction from '../../components/AddTransaction';
import ConfirmDialog from '../../components/ConfirmDialog';
import { 
  Users, 
  ArrowLeft,
  UserPlus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  PlusCircle,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react';

const GroupDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [group, setGroup] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, transactionId: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchGroupDetails();
    }
  }, [token, id]);

  const fetchGroupDetails = async () => {
    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Fetch group info
      const groupRes = await fetch(`${API_BASE_URL}/api/groups/${id}`, { headers });
      const groupData = await groupRes.json();
      setGroup(groupData);

      // Fetch group members
      const membersRes = await fetch(`${API_BASE_URL}/api/groups/${id}/members`, { headers });
      const membersData = await membersRes.json();
      setMembers(membersData);

      // Fetch group transactions
      const transRes = await fetch(`${API_BASE_URL}/api/groups/${id}/transactions`, { headers });
      const transData = await transRes.json();
      setTransactions(transData);

      // Calculate balances
      calculateBalances(transData, membersData);

      setLoading(false);
    } catch (error) {
      console.error("Error fetching group details:", error);
      setLoading(false);
    }
  };

  const calculateBalances = (transactions, members) => {
    const balanceMap = {};
    
    // Initialize balance for each member
    members.forEach(member => {
      balanceMap[member.id] = {
        name: member.username || member.email,
        email: member.email,
        paid: 0,
        owed: 0,
        balance: 0
      };
    });

    // Calculate paid and owed amounts
    transactions.forEach(tx => {
      // Person who paid gets credit for the full amount
      if (balanceMap[tx.user?.id]) {
        balanceMap[tx.user.id].paid += tx.amount;
      }
      
      // If expense is split, each person owes their share
      if (tx.splitUsers && tx.splitUsers.length > 0) {
        const splitAmount = tx.amount / tx.splitUsers.length;
        tx.splitUsers.forEach(user => {
          if (balanceMap[user.id]) {
            balanceMap[user.id].owed += splitAmount;
          }
        });
      }
    });

    // Calculate net balance (positive = owed money, negative = owes money)
    Object.keys(balanceMap).forEach(userId => {
      balanceMap[userId].balance = balanceMap[userId].paid - balanceMap[userId].owed;
    });

    setBalances(Object.values(balanceMap));
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await fetch(`${API_BASE_URL}/api/groups/${id}/members`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: newMemberEmail })
      });

      if (response.ok) {
        setShowAddMember(false);
        setNewMemberEmail('');
        fetchGroupDetails();
      }
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const totalSpent = transactions.reduce((sum, tx) => sum + tx.amount, 0);

  const handleDeleteClick = (transactionId) => {
    setDeleteConfirm({ show: true, transactionId });
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await fetch(`${API_BASE_URL}/api/transactions/${deleteConfirm.transactionId}`, {
        method: 'DELETE',
        headers
      });

      if (response.ok || response.status === 204) {
        toast.success('Transaction deleted successfully');
        fetchGroupDetails();
        setDeleteConfirm({ show: false, transactionId: null });
      } else {
        toast.error('Failed to delete transaction');
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      toast.error('Network error. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  if (!group) return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Group not found</h2>
        <button onClick={() => navigate('/groups')} className="text-primary hover:underline">
          ← Back to Groups
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex-1 p-10">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/groups')}
            className="flex items-center text-neutral-600 hover:text-primary mb-4 transition"
          >
            <ArrowLeft className="h-5 w-5 mr-2" /> Back to Groups
          </button>
          
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center mb-3">
                <div className="p-3 bg-primary/10 rounded-full text-primary mr-4">
                  <Users className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-neutral-800">{group.name}</h2>
                  <p className="text-neutral-500 mt-1">{group.description}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddMember(true)}
                className="border border-primary text-primary px-4 py-2 rounded-lg flex items-center hover:bg-primary/10 transition"
              >
                <UserPlus className="mr-2 h-5 w-5" /> Add Member
              </button>
              <button 
                onClick={() => setShowAddTransaction(true)}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center transition"
              >
                <PlusCircle className="mr-2 h-5 w-5" /> Add Expense
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-neutral-500 text-sm">Total Spent</p>
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">LKR {totalSpent.toLocaleString()}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-neutral-500 text-sm">Total Members</p>
              <Users className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">{members.length}</h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-neutral-500 text-sm">Transactions</p>
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">{transactions.length}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Members & Balances */}
          <div className="lg:col-span-1 space-y-6">
            {/* Members & Balances Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                Members & Balances ({members.length})
              </h3>
              <div className="space-y-3">
                {balances.map((balance, index) => (
                  <div key={index} className="p-3 bg-neutral-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold mr-3">
                        {balance.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-neutral-800">{balance.name}</p>
                        <p className="text-xs text-neutral-400">{balance.email}</p>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-neutral-600 pl-13">
                      <span>Paid: <span className="font-semibold text-success">{balance.paid.toFixed(2)}</span></span>
                      <span>Owes: <span className="font-semibold text-error">{balance.owed.toFixed(2)}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <div className="p-6 border-b border-neutral-100">
                <h3 className="text-lg font-bold text-neutral-800">Group Expenses</h3>
              </div>
              
              {transactions.length > 0 ? (
                <div className="divide-y divide-neutral-100">
                  {transactions.map(tx => (
                    <div key={tx.id} className="p-6 hover:bg-neutral-50 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-neutral-800 mb-1">{tx.description}</h4>
                          <p className="text-sm text-neutral-500">
                            Paid by {tx.user?.username || tx.user?.email || 'Unknown'}
                          </p>
                        </div>
                        <div className="text-right flex items-start gap-4">
                          <div>
                            <p className="text-xl font-bold text-neutral-800">LKR {tx.amount.toLocaleString()}</p>
                            <p className="text-xs text-neutral-500">{tx.date}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(tx.id)}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition"
                            title="Delete transaction"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      
                      {tx.splitUsers && tx.splitUsers.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-100">
                          <p className="text-xs text-neutral-500 mb-2">Split between:</p>
                          <div className="flex flex-wrap gap-2">
                            {tx.splitUsers.map(user => (
                              <span 
                                key={user.id}
                                className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                              >
                                {user.username || user.email}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {tx.category && (
                        <div className="mt-2">
                          <span className="inline-block px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-xs">
                            {tx.category.name}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-block p-4 bg-neutral-100 rounded-full mb-4">
                    <AlertCircle className="h-8 w-8 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500">No expenses yet</p>
                  <button 
                    onClick={() => setShowAddTransaction(true)}
                    className="mt-4 text-primary hover:underline text-sm"
                  >
                    Add your first expense
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-neutral-800 mb-6">Add Member</h3>
            <form onSubmit={handleAddMember}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Member Email
                </label>
                <input
                  type="email"
                  required
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="friend@example.com"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMember(false)}
                  className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddTransaction && (
        <AddTransaction 
          onClose={() => setShowAddTransaction(false)}
          onSuccess={fetchGroupDetails}
          groupId={id}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, transactionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This will affect the group balances and cannot be undone."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default GroupDetails;

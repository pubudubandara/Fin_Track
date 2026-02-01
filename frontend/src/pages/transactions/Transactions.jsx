import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../../components/Sidebar';
import AddTransaction from '../../components/AddTransaction';
import ConfirmDialog from '../../components/ConfirmDialog';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  Trash2
} from 'lucide-react';

const Transactions = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, transactionId: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchTransactions();
    }
  }, [token]);

  const fetchTransactions = async () => {
    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await fetch(`${API_BASE_URL}/api/transactions`, { headers });
      const data = await response.json();
      setTransactions(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  const totalIncome = transactions
    .filter(tx => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalExpense = transactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + tx.amount, 0);

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
        fetchTransactions();
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

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-neutral-800">Transactions</h2>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center transition"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add Transaction
          </button>
        </header>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center">
            <div className="p-3 bg-success/10 rounded-full mr-4 text-success">
              <ArrowUpRight className="h-6 w-6" />
            </div>
            <div>
              <p className="text-neutral-500 text-sm">Total Income</p>
              <h4 className="text-2xl font-bold text-neutral-800">LKR {totalIncome.toLocaleString()}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center">
            <div className="p-3 bg-error/10 rounded-full mr-4 text-error">
              <ArrowDownLeft className="h-6 w-6" />
            </div>
            <div>
              <p className="text-neutral-500 text-sm">Total Expenses</p>
              <h4 className="text-2xl font-bold text-neutral-800">LKR {totalExpense.toLocaleString()}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <p className="text-neutral-500 text-sm mb-1">Net Balance</p>
            <h3 className={`text-2xl font-bold ${totalIncome - totalExpense >= 0 ? 'text-success' : 'text-error'}`}>
              LKR {(totalIncome - totalExpense).toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('ALL')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === 'ALL' 
                    ? 'bg-primary text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterType('INCOME')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === 'INCOME' 
                    ? 'bg-success text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Income
              </button>
              <button
                onClick={() => setFilterType('EXPENSE')}
                className={`px-4 py-2 rounded-lg transition ${
                  filterType === 'EXPENSE' 
                    ? 'bg-error text-white' 
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Expenses
              </button>
            </div>
            <button className="px-4 py-2 border border-neutral-300 rounded-lg hover:bg-neutral-50 flex items-center transition">
              <Download className="h-5 w-5 mr-2" /> Export
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-neutral-50 text-neutral-500 text-sm">
              <tr>
                <th className="p-4">Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Wallet</th>
                <th className="p-4">Type</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Amount</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map(tx => (
                  <tr key={tx.id} className="hover:bg-neutral-50 transition">
                    <td className="p-4 font-medium text-neutral-800">{tx.description}</td>
                    <td className="p-4 text-neutral-500 text-sm">{tx.category?.name || 'General'}</td>
                    <td className="p-4 text-neutral-500 text-sm">{tx.wallet?.name || 'N/A'}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        tx.type === 'INCOME' 
                          ? 'bg-success/10 text-success' 
                          : 'bg-error/10 text-error'
                      }`}>
                        {tx.type === 'INCOME' ? (
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDownLeft className="h-3 w-3 mr-1" />
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-500 text-sm">{tx.date}</td>
                    <td className={`p-4 text-right font-bold ${
                      tx.type === 'EXPENSE' ? 'text-error' : 'text-success'
                    }`}>
                      {tx.type === 'EXPENSE' ? '-' : '+'} LKR {tx.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteClick(tx.id)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition"
                        title="Delete transaction"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-neutral-400">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddTransaction 
          onClose={() => setShowAddModal(false)}
          onSuccess={fetchTransactions}
        />
      )}

      <ConfirmDialog
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, transactionId: null })}
        onConfirm={handleDeleteConfirm}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone and will revert the wallet balance changes."
        confirmText="Delete"
        loading={deleting}
      />
    </div>
  );
};

export default Transactions;

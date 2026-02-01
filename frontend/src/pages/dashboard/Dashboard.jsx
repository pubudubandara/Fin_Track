import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import AddTransaction from '../../components/AddTransaction';
import NewWallet from '../../components/NewWallet';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle,
  Search
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  // States for data
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [showNewWallet, setShowNewWallet] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [walletFilter, setWalletFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Check if token exists, if not redirect to login
  useEffect(() => {
    if (!token) {
      navigate('/login');
    } else {
      fetchDashboardData();
    }
  }, [token]);

  // 2. Fetch Data from Backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      // Get Wallets
      const walletRes = await fetch(`${API_BASE_URL}/api/wallets`, { headers });
      if (!walletRes.ok) {
        throw new Error(`Failed to fetch wallets: ${walletRes.status}`);
      }
      const walletData = await walletRes.json();
      setWallets(walletData || []);

      // Get Transactions
      const transRes = await fetch(`${API_BASE_URL}/api/transactions`, { headers });
      if (!transRes.ok) {
        throw new Error(`Failed to fetch transactions: ${transRes.status}`);
      }
      const transData = await transRes.json();
      setTransactions(transData || []);

    } catch (error) {
      console.error("Error fetching data:", error);
      // Optional: Show error toast/message to user
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  // Calculate total income and expenses
  const totalIncome = transactions
    .filter(tx => tx.type === 'INCOME')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);
  
  const totalExpenses = transactions
    .filter(tx => tx.type === 'EXPENSE')
    .reduce((sum, tx) => sum + (tx.amount || 0), 0);

  // Calculate initial value for wallets
  const calculateInitialValue = (wallet) => {
    const walletTransactions = transactions.filter(tx => tx.wallet?.id === wallet.id);
    const walletIncome = walletTransactions
      .filter(tx => tx.type === 'INCOME')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    const walletExpenses = walletTransactions
      .filter(tx => tx.type === 'EXPENSE')
      .reduce((sum, tx) => sum + (tx.amount || 0), 0);
    
    return (wallet.balance || 0) - walletIncome + walletExpenses;
  };

  // Get unique categories from transactions
  const categories = [...new Map(transactions
    .filter(tx => tx.category)
    .map(tx => [tx.category.id, tx.category]))
    .values()];

  // Filter transactions based on selected filters
  const filteredTransactions = transactions.filter(tx => {
    const searchMatch = !searchTerm || tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const categoryMatch = !categoryFilter || tx.category?.id?.toString() === categoryFilter;
    const walletMatch = !walletFilter || tx.wallet?.id?.toString() === walletFilter;
    return searchMatch && categoryMatch && walletMatch;
  });

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <Sidebar />

      {/* --- Main Content --- */}
      <div className="flex-1 p-10">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-neutral-800">Account Overview</h2>
          <button 
            onClick={() => setShowAddTransaction(true)}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center transition"
          >
            <PlusCircle className="mr-2 h-5 w-5" /> Add Transaction
          </button>
        </header>

        {/* --- Summary Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <p className="text-neutral-500 text-sm mb-1">Total Balance</p>
            <h3 className="text-3xl font-bold text-neutral-800">
              LKR {wallets.reduce((acc, curr) => acc + (curr.balance || 0), 0).toLocaleString()}
            </h3>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center">
            <div className="p-3 bg-success/10 rounded-full mr-4 text-success"><ArrowUpRight /></div>
            <div>
              <p className="text-neutral-500 text-sm">Income (Total)</p>
              <h4 className="text-xl font-bold text-neutral-800">LKR {totalIncome.toLocaleString()}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex items-center">
            <div className="p-3 bg-error/10 rounded-full mr-4 text-error"><ArrowDownLeft /></div>
            <div>
              <p className="text-neutral-500 text-sm">Expenses (Total)</p>
              <h4 className="text-xl font-bold text-neutral-800">LKR {totalExpenses.toLocaleString()}</h4>
            </div>
          </div>
        </div>

        {/* --- Wallets Section --- */}
        <h3 className="text-xl font-bold text-neutral-800 mb-6">My Wallets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {wallets.map(wallet => (
            <div key={wallet.id} className="bg-gradient-to-br from-primary to-primary-dark p-6 rounded-2xl text-white shadow-md">
              <Wallet className="mb-4 h-6 w-6 opacity-80" />
              <p className="opacity-80 text-sm">{wallet.name}</p>
              <h4 className="text-xl font-bold">{wallet.currency} {(wallet.balance || 0).toLocaleString()}</h4>
              <p className="opacity-60 text-xs mt-1">
                Initial: {wallet.currency} {calculateInitialValue(wallet).toLocaleString()}
              </p>
            </div>
          ))}
          {/* Add New Wallet Button */}
          <button 
            onClick={() => setShowNewWallet(true)}
            className="border-2 border-dashed border-neutral-300 rounded-2xl flex flex-col items-center justify-center text-neutral-400 hover:border-primary hover:text-primary transition"
          >
            <PlusCircle className="h-8 w-8 mb-2" />
            <span className="text-sm font-medium">New Wallet</span>
          </button>
        </div>

        {/* --- Recent Transactions Table --- */}
        <h3 className="text-xl font-bold text-neutral-800 mb-6">Recent Transactions</h3>
        
        {/* Search and Filters */}
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
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select
                value={walletFilter}
                onChange={(e) => setWalletFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Wallets</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-100">
              <tr>
                <th className="text-left p-4 text-neutral-500 font-medium">Description</th>
                <th className="text-left p-4 text-neutral-500 font-medium">Category</th>
                <th className="text-left p-4 text-neutral-500 font-medium">Wallet</th>
                <th className="text-left p-4 text-neutral-500 font-medium">Date</th>
                <th className="text-left p-4 text-neutral-500 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-neutral-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-neutral-100 hover:bg-neutral-50">
                    <td className="p-4 font-medium text-neutral-800">{tx.description}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-neutral-100 rounded-full text-sm">
                        {tx.category?.name || '-Income-'}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-600">{tx.wallet?.name || 'No Wallet'}</td>
                    <td className="p-4 text-neutral-500 text-sm">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className={`p-4 font-bold ${tx.type === 'EXPENSE' ? 'text-error' : 'text-success'}`}>
                      {tx.type === 'EXPENSE' ? '-' : '+'} LKR {(tx.amount || 0).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showAddTransaction && (
        <AddTransaction 
          onClose={() => setShowAddTransaction(false)}
          onSuccess={fetchDashboardData}
        />
      )}

      {showNewWallet && (
        <NewWallet 
          onClose={() => setShowNewWallet(false)}
          onSuccess={fetchDashboardData}
        />
      )}
    </div>
  );
};

export default Dashboard;
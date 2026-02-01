import { useState } from 'react';
import { X, Wallet } from 'lucide-react';

const NewWallet = ({ onClose, onSuccess }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: '',
    balance: '',
    currency: 'LKR'
  });

  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'LKR', name: 'Sri Lankan Rupee' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'SGD', name: 'Singapore Dollar' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      };

      const response = await fetch(`${API_BASE_URL}/api/wallets`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...formData,
          balance: parseFloat(formData.balance)
        })
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.error("Failed to create wallet");
      }
    } catch (error) {
      console.error("Error creating wallet:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-primary/10 rounded-full mr-3 text-primary">
              <Wallet className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800">Create New Wallet</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition"
          >
            <X className="h-6 w-6 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Wallet Name */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Wallet Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Personal Account, Savings"
            />
          </div>

          {/* Initial Balance */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Initial Balance
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.balance}
              onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="0.00"
            />
          </div>

          {/* Currency */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Currency
            </label>
            <select
              required
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} - {currency.name}
                </option>
              ))}
            </select>
          </div>

          {/* Preview */}
          <div className="mb-6 p-4 bg-gradient-to-br from-primary to-primary-dark rounded-xl text-white">
            <p className="text-sm opacity-80 mb-1">Preview</p>
            <p className="text-lg font-semibold">{formData.name || 'Wallet Name'}</p>
            <p className="text-2xl font-bold mt-2">
              {formData.currency} {formData.balance ? parseFloat(formData.balance).toLocaleString() : '0.00'}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Wallet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewWallet;

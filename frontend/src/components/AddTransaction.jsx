import { useState, useEffect } from "react";
import { X, Users, Check } from "lucide-react";
import CategorySelector from "./CategorySelector";

const AddTransaction = ({ onClose, onSuccess, groupId = null }) => {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    type: "EXPENSE",
    date: new Date().toISOString().split("T")[0],
    category: "",
    subCategory: "",
    categoryId: "",
    walletId: "",
    groupId: groupId,
    splitUserIds: [],
  });

  const [categories, setCategories] = useState([]);
  const [wallets, setWallets] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategoriesAndWallets();
    if (groupId) {
      fetchGroupMembers();
    }
  }, [groupId]);

  const fetchCategoriesAndWallets = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const [categoriesRes, walletsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/categories`, { headers }),
        fetch(`${API_BASE_URL}/api/wallets`, { headers }),
      ]);

      const categoriesData = await categoriesRes.json();
      const walletsData = await walletsRes.json();

      setCategories(categoriesData);
      setWallets(walletsData);

      // Set default values if available
      if (walletsData.length > 0) {
        setFormData((prev) => ({ ...prev, walletId: walletsData[0].id }));
      }
      if (categoriesData.length > 0 && formData.type === "EXPENSE") {
        setFormData((prev) => ({ ...prev, categoryId: categoriesData[0].id }));
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchGroupMembers = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const response = await fetch(
        `${API_BASE_URL}/api/groups/${groupId}/members`,
        { headers },
      );
      const data = await response.json();
      setMembers(data);
      // Auto-select all members by default
      setFormData((prev) => ({ ...prev, splitUserIds: data.map((m) => m.id) }));
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  const toggleMember = (memberId) => {
    setFormData((prev) => ({
      ...prev,
      splitUserIds: prev.splitUserIds.includes(memberId)
        ? prev.splitUserIds.filter((id) => id !== memberId)
        : [...prev.splitUserIds, memberId],
    }));
  };

  const toggleAllMembers = () => {
    setFormData((prev) => ({
      ...prev,
      splitUserIds:
        prev.splitUserIds.length === members.length
          ? []
          : members.map((m) => m.id),
    }));
  };

  const calculateSplitAmount = () => {
    if (!formData.amount || formData.splitUserIds.length === 0) return "0.00";
    return (parseFloat(formData.amount) / formData.splitUserIds.length).toFixed(
      2,
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate category for expense transactions
    if (formData.type === "EXPENSE" && !formData.category) {
      alert("Please select a category");
      setLoading(false);
      return;
    }

    // Validate split members for group expenses
    if (
      groupId &&
      formData.type === "EXPENSE" &&
      formData.splitUserIds.length === 0
    ) {
      alert("Please select at least one member to split the expense with");
      setLoading(false);
      return;
    }

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      // Find or create category for EXPENSE type
      let categoryId = null;
      if (formData.type === "EXPENSE" && formData.category) {
        // Find a category matching the subcategory name (or category if no subcategory)
        const categoryName = formData.subCategory || formData.category;
        const matchingCategory = categories.find(
          (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
        );
        
        if (matchingCategory) {
          categoryId = matchingCategory.id;
        } else {
          // Create new category
          const createCategoryResponse = await fetch(
            `${API_BASE_URL}/api/categories`,
            {
              method: "POST",
              headers,
              body: JSON.stringify({
                name: categoryName,
                type: "EXPENSE",
              }),
            }
          );
          
          if (createCategoryResponse.ok) {
            const newCategory = await createCategoryResponse.json();
            categoryId = newCategory.id;
            setCategories([...categories, newCategory]);
          }
        }
      }

      const payload = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        date: formData.date,
        walletId: formData.walletId,
        groupId: formData.groupId,
        splitUserIds: formData.splitUserIds,
      };

      // Add categoryId only for expense transactions
      if (formData.type === "EXPENSE" && categoryId) {
        payload.categoryId = categoryId;
      }

      const response = await fetch(`${API_BASE_URL}/api/transactions`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess();
        onClose();
      } else {
        console.error("Failed to create transaction");
        const errorData = await response.json();
        alert(`Error: ${errorData.message || "Failed to create transaction"}`);
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-neutral-800">
            Add Transaction
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full transition"
          >
            <X className="h-6 w-6 text-neutral-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Transaction Type */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Transaction Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "EXPENSE" })}
                className={`py-3 px-4 rounded-lg border-2 transition ${
                  formData.type === "EXPENSE"
                    ? "border-error bg-error/10 text-error font-semibold"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                Expense
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "INCOME" })}
                className={`py-3 px-4 rounded-lg border-2 transition ${
                  formData.type === "INCOME"
                    ? "border-success bg-success/10 text-success font-semibold"
                    : "border-neutral-200 text-neutral-600 hover:border-neutral-300"
                }`}
              >
                Income
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Description
            </label>
            <input
              type="text"
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., Grocery shopping"
            />
          </div>

          {/* Amount and Wallet - Side by Side */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {/* Amount */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                onWheel={(e) => e.target.blur()}
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="0.00"
              />
            </div>

            {/* Wallet */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Wallet
              </label>
              <select
                required
                value={formData.walletId}
                onChange={(e) =>
                  setFormData({ ...formData, walletId: e.target.value })
                }
                className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Select a wallet</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} - {wallet.currency}{" "}
                    {wallet.balance?.toLocaleString() || "0"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category - Only for Expenses */}
          {formData.type === "EXPENSE" && (
            <div className="mb-4">
              <CategorySelector formData={formData} setFormData={setFormData} />
            </div>
          )}

          {/* Split Members - Only for Group Expenses */}
          {groupId && formData.type === "EXPENSE" && members.length > 0 && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-neutral-700">
                  <Users className="inline h-4 w-4 mr-1" />
                  Split Between ({formData.splitUserIds.length} selected)
                  {formData.amount && formData.splitUserIds.length > 0 && (
                    <span className="text-xs text-primary ml-2">
                      LKR {calculateSplitAmount()} per person
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={toggleAllMembers}
                  className="text-xs text-primary hover:underline"
                >
                  {formData.splitUserIds.length === members.length
                    ? "Deselect All"
                    : "Select All"}
                </button>
              </div>
              <div className="border border-neutral-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                <div className="grid grid-cols-3 gap-2">
                  {members.map((member) => (
                    <label
                      key={member.id}
                      className={`flex items-center p-2 rounded-lg cursor-pointer transition ${
                        formData.splitUserIds.includes(member.id)
                          ? "bg-primary/10 border-2 border-primary"
                          : "bg-neutral-50 border-2 border-transparent hover:bg-neutral-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.splitUserIds.includes(member.id)}
                        onChange={() => toggleMember(member.id)}
                        className="hidden"
                      />
                      <div
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center mr-2 flex-shrink-0 ${
                          formData.splitUserIds.includes(member.id)
                            ? "bg-primary border-primary"
                            : "border-neutral-300"
                        }`}
                      >
                        {formData.splitUserIds.includes(member.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <p className="font-medium text-neutral-800 text-xs truncate">
                        {member.username}
                      </p>
                    </label>
                  ))}
                </div>
              </div>
              {formData.splitUserIds.length === 0 && (
                <p className="text-xs text-error mt-2">
                  Please select at least one member
                </p>
              )}
            </div>
          )}

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
              disabled={
                loading ||
                (groupId &&
                  formData.type === "EXPENSE" &&
                  formData.splitUserIds.length === 0)
              }
              className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading
                ? "Adding..."
                : groupId
                  ? "Add Group Expense"
                  : "Add Transaction"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;

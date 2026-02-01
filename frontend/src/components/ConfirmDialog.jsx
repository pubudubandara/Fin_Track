import { AlertTriangle, X } from 'lucide-react';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", cancelText = "Cancel", loading = false }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-start mb-6">
          <div className="p-3 bg-error/10 rounded-full mr-4">
            <AlertTriangle className="h-6 w-6 text-error" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-neutral-800 mb-2">{title}</h3>
            <p className="text-neutral-600">{message}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-full transition ml-2"
          >
            <X className="h-5 w-5 text-neutral-500" />
          </button>
        </div>
        
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-neutral-300 rounded-lg hover:bg-neutral-50 transition disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-error hover:bg-error/90 text-white px-4 py-3 rounded-lg transition disabled:opacity-50"
          >
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;

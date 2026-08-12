import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  confirmAction: () => void;
  cancelAction: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  message,
  confirmAction,
  cancelAction,
  confirmText = "Confirm",
  cancelText = "Cancel",
}) => {
  if (!isOpen) return null;

  return (
    <div className="space-y-6 text-slate-200">
      {/* Modal Header & Warning Icon */}
      <div className="flex items-start space-x-4 border-b border-slate-800 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 flex-shrink-0">
          <FaExclamationTriangle className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-red-400 block mb-0.5">
            Confirmation Required
          </span>
          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Confirm Action
          </h3>
        </div>
      </div>

      {/* Message Body */}
      <div className="py-1">
        <p className="text-sm text-slate-300 leading-relaxed">{message}</p>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
        <button
          type="button"
          onClick={cancelAction}
          className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={confirmAction}
          className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/40 transition-all cursor-pointer"
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
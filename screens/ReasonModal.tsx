
import React from 'react';

interface ReasonModalProps {
  title: string;
  reason: string;
  onClose: () => void;
}

const ReasonModal: React.FC<ReasonModalProps> = ({ title, reason, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="reason-modal-title">
      <div className="bg-slate-50 rounded-2xl shadow-2xl p-6 w-full max-w-md flex flex-col max-h-[90vh] animate-fade-in-down">
        <h2 id="reason-modal-title" className="text-xl font-bold text-slate-800 mb-4">{title}</h2>
        
        <div className="overflow-y-auto pr-2 -mr-2 flex-grow bg-white rounded-lg border border-slate-200 shadow-sm p-4">
            <p className="text-slate-700 whitespace-pre-wrap">{reason}</p>
        </div>
        
        <div className="flex justify-end items-center mt-6 pt-4 border-t border-slate-200">
            <button
                type="button"
                onClick={onClose}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg transition-colors duration-200 text-sm shadow-sm"
            >
                Cerrar
            </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
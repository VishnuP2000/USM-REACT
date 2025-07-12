import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 text-2xl"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;

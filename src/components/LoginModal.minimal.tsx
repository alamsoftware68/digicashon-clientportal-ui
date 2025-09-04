'use client';

import React from 'react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Temporary minimal LoginModal to test homepage loading
const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Login Modal</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          This is a temporary non-functional login modal for testing homepage loading.
        </p>
        <p className="text-sm text-gray-500">
          All authentication features have been temporarily disabled.
        </p>
      </div>
    </div>
  );
};

export default LoginModal;

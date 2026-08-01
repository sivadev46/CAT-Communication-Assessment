import React from 'react';
import { RotateCcw, AlertCircle } from 'lucide-react';
import Button from '../Button/Button';

export default function RetryButton({ onRetry, message = 'Failed to load data from server.' }) {
  return (
    <div className="p-8 text-center bg-white rounded-xl border border-rose-100 shadow-xs max-w-md mx-auto my-6">
      <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <p className="text-xs font-semibold text-gray-800 mb-4">{message}</p>
      <Button
        variant="primary"
        onClick={onRetry}
        className="text-xs inline-flex items-center gap-2"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}

import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  text?: string;
  className?: string;
}

export function LoadingSpinner({ text = 'Chargement...', className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400 mr-2" />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}
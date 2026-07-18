import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-6">
      <div 
        className={cn(
          "bg-white border border-gray-200 rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200",
          className
        )}
      >
        <div 
          className="flex items-center justify-between"
          style={{ padding: '32px 32px 16px' }}
        >
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
          <button 
            onClick={onClose}
            className="hover:bg-gray-100 rounded-full transition-colors text-gray-500"
            style={{ padding: '6px' }}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div 
          className="overflow-y-auto"
          style={{ padding: '0 32px 32px' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

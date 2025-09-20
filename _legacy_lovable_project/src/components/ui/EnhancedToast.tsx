import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Bell,
  Star,
  Heart,
  Gift,
} from 'lucide-react';

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'special';
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose: (id: string) => void;
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center';
}

const toastVariants = {
  hidden: {
    opacity: 0,
    x: 300,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: 300,
    scale: 0.8,
    transition: {
      duration: 0.2,
    },
  },
};

const getToastConfig = (type: ToastProps['type']) => {
  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconColor: 'text-green-600',
      titleColor: 'text-green-900',
      descColor: 'text-green-700',
    },
    error: {
      icon: XCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
      descColor: 'text-red-700',
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      iconColor: 'text-yellow-600',
      titleColor: 'text-yellow-900',
      descColor: 'text-yellow-700',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
      descColor: 'text-blue-700',
    },
    special: {
      icon: Star,
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      iconColor: 'text-purple-600',
      titleColor: 'text-purple-900',
      descColor: 'text-purple-700',
    },
  };

  return configs[type];
};

export const EnhancedToast: React.FC<ToastProps> = ({
  id,
  title,
  description,
  type,
  action,
  onClose,
  position = 'top-right',
}) => {
  const config = getToastConfig(type);
  const Icon = config.icon;

  return (
    <motion.div
      variants={toastVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={cn(
        'relative max-w-sm w-full rounded-lg border shadow-lg',
        config.bgColor,
        config.borderColor,
        'overflow-hidden'
      )}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
      />

      <div className="relative p-4">
        <div className="flex items-start">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className={cn('flex-shrink-0', config.iconColor)}
          >
            <Icon className="w-5 h-5" />
          </motion.div>

          <div className="ml-3 flex-1">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={cn('text-sm font-medium', config.titleColor)}
            >
              {title}
            </motion.h3>

            {description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={cn('mt-1 text-sm', config.descColor)}
              >
                {description}
              </motion.p>
            )}

            {action && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-3"
              >
                <button
                  onClick={action.onClick}
                  className={cn(
                    'text-sm font-medium underline hover:no-underline transition-all duration-200',
                    config.titleColor
                  )}
                >
                  {action.label}
                </button>
              </motion.div>
            )}
          </div>

          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            onClick={() => onClose(id)}
            className={cn(
              'flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black/10 transition-colors duration-200',
              config.iconColor
            )}
          >
            <X className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-1 bg-current opacity-30"
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 5, ease: 'linear' }}
      />
    </motion.div>
  );
};

// Toast Container
interface ToastContainerProps {
  toasts: ToastProps[];
  onClose: (id: string) => void;
  position?: ToastProps['position'];
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onClose,
  position = 'top-right',
}) => {
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
  };

  return (
    <div className={cn('fixed z-50 space-y-2', positionClasses[position])}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <EnhancedToast
            key={toast.id}
            {...toast}
            onClose={onClose}
            position={position}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

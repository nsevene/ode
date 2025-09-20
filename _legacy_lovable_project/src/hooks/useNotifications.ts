import { useCallback } from 'react';
import { toast } from 'sonner';
import { useAppStore } from '@/store/appStore';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '@/lib/constants';

export const useNotifications = () => {
  const { addNotification } = useAppStore();

  // Success notifications
  const showSuccess = useCallback(
    (message: string, title?: string) => {
      toast.success(message, {
        title,
        duration: 4000,
      });

      addNotification({
        type: 'success',
        title: title || 'Success',
        message,
      });
    },
    [addNotification]
  );

  // Error notifications
  const showError = useCallback(
    (message: string, title?: string) => {
      toast.error(message, {
        title,
        duration: 6000,
      });

      addNotification({
        type: 'error',
        title: title || 'Error',
        message,
      });
    },
    [addNotification]
  );

  // Warning notifications
  const showWarning = useCallback(
    (message: string, title?: string) => {
      toast.warning(message, {
        title,
        duration: 5000,
      });

      addNotification({
        type: 'warning',
        title: title || 'Warning',
        message,
      });
    },
    [addNotification]
  );

  // Info notifications
  const showInfo = useCallback(
    (message: string, title?: string) => {
      toast.info(message, {
        title,
        duration: 4000,
      });

      addNotification({
        type: 'info',
        title: title || 'Info',
        message,
      });
    },
    [addNotification]
  );

  // Loading notifications
  const showLoading = useCallback((message: string, title?: string) => {
    return toast.loading(message, {
      title,
    });
  }, []);

  // Dismiss loading notification
  const dismissLoading = useCallback((toastId: string | number) => {
    toast.dismiss(toastId);
  }, []);

  // Promise-based notifications
  const showPromise = useCallback(
    (
      promise: Promise<any>,
      {
        loading,
        success,
        error,
      }: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      return toast.promise(promise, {
        loading,
        success,
        error,
      });
    },
    []
  );

  // Business logic notifications
  const showUserCreated = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.USER_CREATED);
  }, [showSuccess]);

  const showUserUpdated = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.USER_UPDATED);
  }, [showSuccess]);

  const showUserDeleted = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.USER_DELETED);
  }, [showSuccess]);

  const showBookingCreated = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.BOOKING_CREATED);
  }, [showSuccess]);

  const showBookingUpdated = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.BOOKING_UPDATED);
  }, [showSuccess]);

  const showBookingCancelled = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.BOOKING_CANCELLED);
  }, [showSuccess]);

  const showTenantApplicationSubmitted = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.TENANT_APPLICATION_SUBMITTED);
  }, [showSuccess]);

  const showTenantApplicationApproved = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.TENANT_APPLICATION_APPROVED);
  }, [showSuccess]);

  const showTenantApplicationRejected = useCallback(() => {
    showSuccess(SUCCESS_MESSAGES.TENANT_APPLICATION_REJECTED);
  }, [showSuccess]);

  // Error notifications
  const showNetworkError = useCallback(() => {
    showError(ERROR_MESSAGES.NETWORK);
  }, [showError]);

  const showUnauthorizedError = useCallback(() => {
    showError(ERROR_MESSAGES.UNAUTHORIZED);
  }, [showError]);

  const showForbiddenError = useCallback(() => {
    showError(ERROR_MESSAGES.FORBIDDEN);
  }, [showError]);

  const showNotFoundError = useCallback(() => {
    showError(ERROR_MESSAGES.NOT_FOUND);
  }, [showError]);

  const showValidationError = useCallback(() => {
    showError(ERROR_MESSAGES.VALIDATION);
  }, [showError]);

  const showServerError = useCallback(() => {
    showError(ERROR_MESSAGES.SERVER);
  }, [showError]);

  const showTimeoutError = useCallback(() => {
    showError(ERROR_MESSAGES.TIMEOUT);
  }, [showError]);

  const showUnknownError = useCallback(() => {
    showError(ERROR_MESSAGES.UNKNOWN);
  }, [showError]);

  return {
    // Basic notifications
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
    dismissLoading,
    showPromise,

    // Business logic notifications
    showUserCreated,
    showUserUpdated,
    showUserDeleted,
    showBookingCreated,
    showBookingUpdated,
    showBookingCancelled,
    showTenantApplicationSubmitted,
    showTenantApplicationApproved,
    showTenantApplicationRejected,

    // Error notifications
    showNetworkError,
    showUnauthorizedError,
    showForbiddenError,
    showNotFoundError,
    showValidationError,
    showServerError,
    showTimeoutError,
    showUnknownError,
  };
};

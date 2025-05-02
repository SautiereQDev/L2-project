import { toast } from 'vue-sonner';

interface NotificationOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onDismiss?: () => void;
}

class NotificationService {
  /**
   * Affiche une notification de succès
   */
  success(message: string, options?: NotificationOptions) {
    return toast.success(message, {
      duration: options?.duration ?? 4000,
      ...options,
    });
  }

  /**
   * Affiche une notification d'erreur
   */
  error(message: string, options?: NotificationOptions) {
    return toast.error(message, {
      duration: options?.duration ?? 5000,
      ...options,
    });
  }

  /**
   * Affiche une notification d'avertissement
   */
  warning(message: string, options?: NotificationOptions) {
    return toast.warning(message, {
      duration: options?.duration ?? 5000,
      ...options,
    });
  }

  /**
   * Affiche une notification informative
   */
  info(message: string, options?: NotificationOptions) {
    return toast.info(message, {
      duration: options?.duration ?? 4000,
      ...options,
    });
  }

  /**
   * Affiche une notification avec une action
   */
  withAction(message: string, actionLabel: string, onAction: () => void, options?: NotificationOptions) {
    return toast(message, {
      action: {
        label: actionLabel,
        onClick: onAction,
      },
      ...options,
    });
  }

  /**
   * Ferme une notification spécifique par son ID
   */
  dismiss(id: string | number) {
    toast.dismiss(id);
  }

  /**
   * Ferme toutes les notifications
   */
  dismissAll() {
    toast.dismiss();
  }
}

export default new NotificationService();

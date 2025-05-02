<template>
  <Toaster 
    position="top-right"
    :expand="expand"
    :visibleToasts="visibleToasts"
    :gap="gap"
    :duration="baseDuration"
    :class="className"
    :toastOptions="toastOptions"
    :close-button="true"
  >
    <template #default="{ toast }">
      <div class="flex items-center gap-3">
        <!-- Icône basée sur le type -->
        <component 
          :is="getIcon(toast.type)" 
          :class="[
            'h-5 w-5',
            getIconColor(toast.type)
          ]"
        />
        
        <!-- Contenu du toast -->
        <div class="flex-1">
          <div v-if="toast.title" class="font-medium text-sm text-gray-900 dark:text-white">
            {{ toast.title }}
          </div>
          <div class="text-sm text-gray-600 dark:text-gray-300">
            {{ toast.message }}
          </div>
        </div>
      </div>
    </template>
  </Toaster>
</template>

<script setup lang="ts">
import { Toaster } from 'vue-sonner';
import { 
  ExclamationCircleIcon, 
  InformationCircleIcon, 
  CheckCircleIcon,
  ExclamationTriangleIcon 
} from '@heroicons/vue/24/solid';
import { type Toaster as SonnerToast } from 'vue-sonner';

interface Props {
  expand?: boolean;
  visibleToasts?: number;
  gap?: number;
  baseDuration?: number;
  className?: string;
}

type SonnerToastType = typeof SonnerToast;

const props = withDefaults(defineProps<Props>(), {
  expand: true,
  visibleToasts: 3,
  gap: 8,
  baseDuration: 4000,
  className: '',
});

const toastOptions: any = {
  success: {
    className: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-lg',
    descriptionClassName: 'text-gray-600 dark:text-gray-300'
  },
  error: {
    className: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-lg',
    descriptionClassName: 'text-gray-600 dark:text-gray-300'
  },
  warning: {
    className: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-lg',
    descriptionClassName: 'text-gray-600 dark:text-gray-300'
  },
  info: {
    className: 'bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-lg',
    descriptionClassName: 'text-gray-600 dark:text-gray-300'
  }
};


/** Extend Sonner’s Toast with our stricter “type” union */
export interface CustomToast extends SonnerToastType {
  type: 'success' | 'error' | 'warning' | 'info'
}

/** Alias for the toast type field */
type ToastType = CustomToast['type']

// Fonction pour obtenir l'icône en fonction du type de toast
const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return ExclamationCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    case 'info':
    default:
      return InformationCircleIcon;
  }
};

// Fonction pour obtenir la couleur de l'icône en fonction du type de toast
const getIconColor = (type: ToastType) => {
  switch (type) {
    case 'success':
      return 'text-success-DEFAULT';
    case 'error':
      return 'text-error-DEFAULT';
    case 'warning':
      return 'text-warning-DEFAULT';
    case 'info':
    default:
      return 'text-info-DEFAULT';
  }
};
</script>

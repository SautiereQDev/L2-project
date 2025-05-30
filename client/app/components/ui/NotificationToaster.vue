<template>
  <Toaster
    position="top-right"
    :expand="expand"
    :visible-toasts="visibleToasts"
    :gap="gap"
    :duration="baseDuration"
    :class="className"
    :toast-options="toastOptions"
    :close-button="true"
  >
    <template #default="{ toast }">
      <div class="flex items-center gap-3">
        <!-- Icône basée sur le type -->
        <component
          :is="getIcon(toast.type)"
          :class="['h-5 w-5', getIconColor(toast.type)]"
        />

        <!-- Contenu du toast -->
        <div class="flex-1">
          <div
            v-if="toast.title"
            class="font-medium text-sm text-gray-900 dark:text-white"
          >
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
import { Toaster } from "vue-sonner";
import {
  ExclamationCircleIcon,
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/vue/24/solid";

interface Props {
  expand?: boolean;
  visibleToasts?: number;
  gap?: number;
  baseDuration?: number;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  expand: true,
  visibleToasts: 3,
  gap: 8,
  baseDuration: 4000,
  className: "",
});

const toastOptions = {
  className:
    "bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 rounded-lg",
  descriptionClassName: "text-gray-600 dark:text-gray-300",
};

// Fonction pour obtenir l'icône en fonction du type de toast
const getIcon = (type) => {
  switch (type) {
    case "success":
      return CheckCircleIcon;
    case "error":
      return ExclamationCircleIcon;
    case "warning":
      return ExclamationTriangleIcon;
    case "info":
    default:
      return InformationCircleIcon;
  }
};

// Fonction pour obtenir la couleur de l'icône en fonction du type de toast
const getIconColor = (type) => {
  switch (type) {
    case "success":
      return "text-success-DEFAULT";
    case "error":
      return "text-error-DEFAULT";
    case "warning":
      return "text-warning-DEFAULT";
    case "info":
    default:
      return "text-info-DEFAULT";
  }
};
</script>

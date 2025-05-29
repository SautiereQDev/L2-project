<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 disabled:pointer-events-none disabled:opacity-50',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      className,
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <Spinner v-if="loading" class="mr-2 h-4 w-4" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import Spinner from "./Spinner.vue";

interface Props {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
  fullWidth: false,
  className: "",
});

const emit = defineEmits(["click"]);

const variantClasses = computed(() => ({
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600",
  outline:
    "border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
  ghost:
    "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-50 data-[state=open]:bg-transparent",
  link: "bg-transparent text-primary-600 underline-offset-4 hover:underline dark:text-primary-400 p-0 h-auto",
  destructive: "bg-error-DEFAULT text-white hover:bg-error-dark",
}));

const sizeClasses = computed(() => ({
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 py-2",
  lg: "h-12 px-6 py-3 text-base",
  icon: "h-10 w-10",
}));

const handleClick = (event: Event) => {
  if (!props.disabled && !props.loading) {
    emit("click", event);
  }
};
</script>

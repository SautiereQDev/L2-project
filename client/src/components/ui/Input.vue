<template>
  <div class="relative w-full" :class="containerClass">
    <label
      v-if="label"
      :for="id"
      class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
    >
      {{ label }}
      <span v-if="required" class="text-error-DEFAULT ml-1">*</span>
    </label>
    
    <div class="relative">
      <!-- Icône de début (optionnelle) -->
      <div
        v-if="leadingIcon"
        class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"
      >
        <component :is="leadingIcon" class="h-5 w-5" aria-hidden="true" />
      </div>
      
      <input
        :id="id"
        ref="input"
        v-bind="$attrs"
        :value="modelValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="block w-full rounded-md border bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500 dark:border-gray-700 dark:focus:ring-primary-400"
        :class="[
          error ? 'border-error-DEFAULT focus:border-error-DEFAULT focus:ring-error-DEFAULT' : 'border-gray-300 dark:border-gray-600',
          leadingIcon ? 'pl-10' : '',
          trailingIcon || clearable ? 'pr-10' : '',
          inputClass
        ]"
        @input="onInput"
        @blur="onBlur"
      />
      
      <!-- Bouton d'effacement (quand clearable est true) -->
      <button
        v-if="clearable && modelValue"
        type="button"
        class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer hover:text-gray-500"
        @click="onClear"
        aria-label="Effacer"
      >
        <XMarkIcon class="h-5 w-5" />
      </button>
      
      <!-- Icône de fin (optionnelle) -->
      <div
        v-else-if="trailingIcon"
        class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400"
      >
        <component :is="trailingIcon" class="h-5 w-5" aria-hidden="true" />
      </div>
    </div>
    
    <!-- Message d'erreur -->
    <p
      v-if="error"
      :id="`${id}-error`"
      class="mt-1 text-sm text-error-DEFAULT"
    >
      {{ error }}
    </p>
    
    <!-- Texte d'aide -->
    <p
      v-else-if="helperText"
      class="mt-1 text-sm text-gray-500 dark:text-gray-400"
    >
      {{ helperText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/solid';

interface Props {
  modelValue: string | number;
  id?: string;
  label?: string;
  helperText?: string;
  error?: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  leadingIcon?: any; // Composant d'icône
  trailingIcon?: any; // Composant d'icône
  containerClass?: string;
  inputClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => `input-${Math.random().toString(36).substring(2, 9)}`,
  label: undefined,
  helperText: undefined,
  error: undefined,
  placeholder: '',
  type: 'text',
  disabled: false,
  required: false,
  clearable: false,
  leadingIcon: undefined,
  trailingIcon: undefined,
  containerClass: '',
  inputClass: '',
});

const emit = defineEmits(['update:modelValue', 'blur', 'clear']);

const input = ref<HTMLInputElement | null>(null);

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

const onBlur = (event: Event) => {
  emit('blur', event);
};

const onClear = () => {
  emit('update:modelValue', '');
  emit('clear');
  // Focus sur l'input après effacement
  if (input.value) {
    input.value.focus();
  }
};
</script>

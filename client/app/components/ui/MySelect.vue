<template>
  <div class="ui-select">
    <USelect
      v-model="value"
      :items="items"
      :placeholder="placeholder"
      :size="size"
      :clearable="clearable"
      :disabled="disabled"
      :loading="loading"
      :color="color"
      :variant="variant"
      :arrow="arrow"
      :multiple="multiple"
      :searchable="searchable"
      :searchable-placeholder="searchablePlaceholder"
      :ui="ui"
      class="w-full"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      @change="$emit('change', $event)"
    >
      <!-- Leading Icon Handling -->
      <template #leading v-if="$slots.leading">
        <slot name="leading" />
      </template>
      <template #leading v-else-if="icon">
        <Icon :name="icon" class="w-4 h-4" /> 
      </template>

      <!-- Trailing Icon Handling -->
      <template #trailing v-if="$slots.trailing">
        <slot name="trailing" />
      </template>
      <template #trailing v-else-if="trailingIcon">
        <Icon :name="trailingIcon" class="w-5 h-5" />
      </template>

      <!-- Pass through other slots -->
      <template v-for="slotDef in passThroughSlots" #[slotDef.name]="slotData" :key="slotDef.name">
        <slot :name="slotDef.name" v-bind="slotData" />
      </template>
    </USelect>
  </div>
</template>

<script setup>
import { computed, useSlots } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number, Array, Object],
    default: null
  },
  options: {
    type: Array,
    default: () => []
  },
  items: {
    type: Array,
    default: () => []
  },
  placeholder: {
    type: String,
    default: 'Sélectionner...'
  },
  size: {
    type: String,
    default: 'md'
  },
  clearable: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'primary'
  },
  variant: {
    type: String,
    default: 'outline'
  },
  icon: { // Expects "heroicons:name" or similar for <Icon>
    type: String,
    default: null
  },
  trailingIcon: { // Expects "heroicons:name" or similar for <Icon>
    type: String,
    default: 'heroicons:chevron-down' // Updated default
  },
  loading: {
    type: Boolean,
    default: false
  },
  arrow: { // USelect prop
    type: Boolean,
    default: false
  },
  // selectedIcon prop removed as USelect does not use it
  ui: {
    type: Object,
    default: () => ({})
  },
  multiple: {
    type: Boolean,
    default: false
  },
  searchable: {
    type: Boolean,
    default: false
  },
  searchablePlaceholder: {
    type: String,
    default: 'Rechercher...'
  }
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur', 'change']);

const value = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

const slots = useSlots();

// Pass through all slots not explicitly handled (leading, trailing)
const passThroughSlots = computed(() => {
  return Object.keys(slots)
    .filter(name => name !== 'leading' && name !== 'trailing')
    .map(name => ({ name }));
});

</script>

<style scoped>
.ui-select {
  position: relative;
  z-index: 10; /* Ensure select menu appears above other elements */
}
</style>

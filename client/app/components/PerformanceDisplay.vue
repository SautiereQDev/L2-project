<template>
  <div 
    class="performance-display inline-flex items-center"
    :class="[sizeClasses, colorClasses]"
  >
    <UIcon 
      v-if="showIcon"
      :name="icon" 
      class="performance-icon mr-1.5" 
      :class="iconSizeClass"
    />
    <span class="font-mono font-medium" :class="valueClass">
      {{ formattedValue }}
    </span>
    <span 
      v-if="showUnit" 
      class="performance-unit ml-1 opacity-80 font-normal" 
      :class="unitClass"
    >
      {{ unit }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { DisciplineType } from '~/types/record.types'

const props = defineProps({
  /**
   * Valeur de la performance (temps en secondes ou distance en mètres)
   */
  value: {
    type: Number,
    required: true
  },
  /**
   * Type de discipline (run, jump, throw)
   */
  disciplineType: {
    type: String,
    required: true
  },
  /**
   * Taille de l'affichage (sm, md, lg)
   */
  size: {
    type: String,
    default: 'md'
  },
  /**
   * Variante de couleur (normal, solid, subtle)
   */
  variant: {
    type: String,
    default: 'normal'
  },
  /**
   * Afficher l'icône ou non
   */
  showIcon: {
    type: Boolean,
    default: true
  },
  /**
   * Afficher l'unité ou non
   */
  showUnit: {
    type: Boolean,
    default: true
  }
})

/**
 * Calcul de l'icône en fonction du type de discipline
 */
const icon = computed(() => {
  switch (props.disciplineType) {
    case DisciplineType.RUN: 
      return 'i-heroicons-clock'
    case DisciplineType.JUMP:
    case DisciplineType.THROW:
      return 'i-heroicons-ruler'
    default:
      return 'i-heroicons-trophy'
  }
})

/**
 * Déterminer l'unité de mesure
 */
const unit = computed(() => {
  if (props.disciplineType === DisciplineType.RUN) {
    return '';  // L'unité est déjà dans le format MM:SS.MS
  } else {
    return 'm'; // Mètres pour les sauts et lancers
  }
})

/**
 * Formater la performance selon le type de discipline
 */
const formattedValue = computed(() => {
  if (props.disciplineType === DisciplineType.RUN) {
    // Format time MM:SS.MS for running events
    const minutes = Math.floor(props.value / 60);
    const seconds = Math.floor(props.value % 60);
    const milliseconds = Math.round((props.value % 1) * 100);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  } else {
    // Format distance in meters for jumps and throws
    return props.value.toFixed(2);
  }
})

/**
 * Classes de taille en fonction de la taille spécifiée
 */
const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs': 
      return 'text-xs'
    case 'sm': 
      return 'text-sm'
    case 'md': 
      return 'text-base'
    case 'lg': 
      return 'text-lg'
    case 'xl': 
      return 'text-xl'
    case '2xl': 
      return 'text-2xl'
    default: 
      return 'text-base'
  }
})

/**
 * Classes de taille pour l'icône
 */
const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'xs': 
      return 'h-3 w-3'
    case 'sm': 
      return 'h-4 w-4'
    case 'md': 
      return 'h-5 w-5'
    case 'lg': 
      return 'h-5 w-5'
    case 'xl': 
      return 'h-6 w-6'
    case '2xl': 
      return 'h-7 w-7'
    default: 
      return 'h-5 w-5'
  }
})

/**
 * Classes de couleur en fonction du type de discipline et de la variante
 */
const colorClasses = computed(() => {
  const colorMap = {
    [DisciplineType.RUN]: {
      normal: 'text-running-600 dark:text-running-400',
      solid: 'text-white bg-running-600 dark:bg-running-500 px-2 py-0.5 rounded-md',
      subtle: 'text-running-700 dark:text-running-300 bg-running-50 dark:bg-running-900/30 px-2 py-0.5 rounded-md'
    },
    [DisciplineType.JUMP]: {
      normal: 'text-jumping-600 dark:text-jumping-400',
      solid: 'text-white bg-jumping-600 dark:bg-jumping-500 px-2 py-0.5 rounded-md',
      subtle: 'text-jumping-700 dark:text-jumping-300 bg-jumping-50 dark:bg-jumping-900/30 px-2 py-0.5 rounded-md'
    },
    [DisciplineType.THROW]: {
      normal: 'text-throwing-600 dark:text-throwing-400',
      solid: 'text-white bg-throwing-600 dark:bg-throwing-500 px-2 py-0.5 rounded-md',
      subtle: 'text-throwing-700 dark:text-throwing-300 bg-throwing-50 dark:bg-throwing-900/30 px-2 py-0.5 rounded-md'
    }
  }

  // Fallback au cas où la discipline n'est pas reconnue
  const defaultColor = {
    normal: 'text-primary-600 dark:text-primary-400',
    solid: 'text-white bg-primary-600 dark:bg-primary-500 px-2 py-0.5 rounded-md',
    subtle: 'text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded-md'
  }

  // Récupère la couleur de la discipline ou utilise la couleur par défaut
  const disciplineColor = colorMap[props.disciplineType as DisciplineType] || defaultColor;
  
  // Retourne la variante appropriée
  return disciplineColor[props.variant as 'normal' | 'solid' | 'subtle'] || disciplineColor.normal;
})

/**
 * Classes pour la valeur
 */
const valueClass = computed(() => {
  if (props.variant !== 'normal') {
    return '';
  }
  
  return 'font-semibold';
})

/**
 * Classes pour l'unité
 */
const unitClass = computed(() => {
  return props.size === 'xs' || props.size === 'sm' ? 'text-xs' : '';
})
</script>

<style scoped>
.performance-display {
  transition: all 0.2s ease;
}

.performance-display:hover .performance-icon {
  transform: scale(1.1);
}

.performance-icon {
  transition: transform 0.2s ease;
}

.performance-unit {
  font-feature-settings: "tnum";
}
</style>

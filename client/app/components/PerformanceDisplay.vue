<template>
  <div
    class="inline-flex items-center text-white transition-all duration-200 ease-in-out group"
    :class="sizeClasses"
  >
    <template v-if="showIcon">
      <ClockIcon 
        v-if="props.disciplineType === DisciplineType.RUN"
        class="mr-1.5 transition-transform duration-200 ease-in-out group-hover:scale-110"
        :class="iconSizeClass"
      />
      <ArrowTrendingUpIcon 
        v-else-if="props.disciplineType === DisciplineType.JUMP || props.disciplineType === DisciplineType.THROW"
        class="mr-1.5 transition-transform duration-200 ease-in-out group-hover:scale-110"
        :class="iconSizeClass"
      />
      <TrophyIcon 
        v-else
        class="mr-1.5 transition-transform duration-200 ease-in-out group-hover:scale-110"
        :class="iconSizeClass"
      />
    </template>
    <span class="font-mono font-medium">
      {{ formattedValue }}
    </span>
    <span
      v-if="showUnit"
      class="ml-1 opacity-80 font-normal tabular-nums"
      :class="unitClass"
    >
      {{ unit }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DisciplineType } from "~/types/record.types";
import { ClockIcon, ArrowTrendingUpIcon, TrophyIcon } from '@heroicons/vue/24/solid';

const props = defineProps({
  /**
   * Valeur de la performance (temps en secondes ou distance en mètres)
   */
  value: {
    type: Number,
    required: true,
  },
  /**
   * Type de discipline (run, jump, throw)
   */
  disciplineType: {
    type: String,
    required: true,
  },
  /**
   * Taille de l'affichage (sm, md, lg)
   */
  size: {
    type: String,
    default: "md",
  },
  /**
   * Variante de couleur (normal, solid, subtle)
   */
  variant: {
    type: String,
    default: "normal",
  },
  /**
   * Afficher l'icône ou non
   */
  showIcon: {
    type: Boolean,
    default: true,
  },
  /**
   * Afficher l'unité ou non
   */
  showUnit: {
    type: Boolean,
    default: true,
  },
});

/**
 * Déterminer l'unité de mesure
 */
const unit = computed(() => {
  if (props.disciplineType === DisciplineType.RUN) {
    return ""; // L'unité est déjà dans le format MM:SS.MS
  } else {
    return "m"; // Mètres pour les sauts et lancers
  }
});

/**
 * Formater la performance selon le type de discipline
 */
const formattedValue = computed(() => {
  // Si la valeur est invalide ou nulle
  if (props.value === undefined || props.value === null || isNaN(props.value)) {
    return "N/A";
  }
  
  // Si la valeur est un timestamp très élevé (erreur de données), normaliser
  let normalizedValue = props.value;
  if (normalizedValue > 1000000) {
    // Pour les courses, on divise pour obtenir des secondes plus réalistes
    // Cela semble être un timestamp
    normalizedValue = normalizedValue > 946684800 ? (normalizedValue % 100) : normalizedValue;
  }

  if (props.disciplineType === DisciplineType.RUN) {
    try {
      // Format time MM:SS.MS for running events
      const minutes = Math.floor(normalizedValue / 60);
      const seconds = Math.floor(normalizedValue % 60);
      const milliseconds = Math.round((normalizedValue % 1) * 100);

      return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}.${milliseconds.toString().padStart(2, "0")}`;
    } catch (e) {
      console.error("Erreur de formatage de temps:", e);
      return "00:00.00";
    }
  } else {
    try {
      // Format distance in meters for jumps and throws
      return normalizedValue.toFixed(2);
    } catch (e) {
      console.error("Erreur de formatage de distance:", e);
      return "0.00";
    }
  }
});

/**
 * Classes de taille en fonction de la taille spécifiée
 */
const sizeClasses = computed(() => {
  switch (props.size) {
    case "xs":
      return "text-xs";
    case "sm":
      return "text-sm";
    case "md":
      return "text-base";
    case "lg":
      return "text-lg";
    case "xl":
      return "text-xl";
    case "2xl":
      return "text-2xl";
    default:
      return "text-base";
  }
});

/**
 * Classes de taille pour l'icône
 */
const iconSizeClass = computed(() => {
  switch (props.size) {
    case "xs":
      return "h-3 w-3";
    case "sm":
      return "h-4 w-4";
    case "md":
      return "h-5 w-5";
    case "lg":
      return "h-5 w-5";
    case "xl":
      return "h-6 w-6";
    case "2xl":
      return "h-7 w-7";
    default:
      return "h-5 w-5";
  }
});

/**
/**
 * Classes pour l'unité
 */
const unitClass = computed(() => {
  return props.size === "xs" || props.size === "sm" ? "text-xs" : "";
});

</script>

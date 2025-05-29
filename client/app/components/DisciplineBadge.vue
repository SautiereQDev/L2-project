<template>
  <UBadge :color="color" :variant="variant" :size="size" :class="badgeClass">
    <template v-if="showIcon && icon" #leading>
      <UIcon :name="icon" class="h-3.5 w-3.5" />
    </template>
    {{ label || formatDisciplineType(type) }}
  </UBadge>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DisciplineType } from "~/types/record.types";

const props = defineProps({
  /**
   * Type de discipline (course, saut, lancer)
   */
  type: {
    type: String as () => DisciplineType,
    required: true,
  },
  /**
   * Libellé à afficher (si non spécifié, utilisera le type formaté)
   */
  label: {
    type: String,
    default: "",
  },
  /**
   * Afficher ou non l'icône
   */
  showIcon: {
    type: Boolean,
    default: true,
  },
  /**
   * Variante du badge (solid, outline, soft, subtle)
   */
  variant: {
    type: String,
    default: "solid",
  },
  /**
   * Taille du badge (xs, sm, md, lg)
   */
  size: {
    type: String,
    default: "sm",
  },
  /**
   * Classes CSS supplémentaires
   */
  badgeClass: {
    type: String,
    default: "",
  },
});

/**
 * Calcul de la couleur en fonction du type de discipline
 */
const color = computed(() => {
  switch (props.type) {
    case DisciplineType.RUN:
      return "running";
    case DisciplineType.JUMP:
      return "jumping";
    case DisciplineType.THROW:
      return "throwing";
    default:
      return "primary";
  }
});

/**
 * Calcul de l'icône en fonction du type de discipline
 */
const icon = computed(() => {
  switch (props.type) {
    case DisciplineType.RUN:
      return "i-heroicons-bolt";
    case DisciplineType.JUMP:
      return "i-heroicons-arrow-trending-up";
    case DisciplineType.THROW:
      return "i-heroicons-hand-raised";
    default:
      return "i-heroicons-trophy";
  }
});

/**
 * Formatage du type de discipline pour l'affichage
 */
function formatDisciplineType(type: DisciplineType): string {
  const types: Record<DisciplineType, string> = {
    [DisciplineType.RUN]: "Course",
    [DisciplineType.JUMP]: "Saut",
    [DisciplineType.THROW]: "Lancer",
  };

  return types[type] || type;
}
</script>

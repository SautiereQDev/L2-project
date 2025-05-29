<template>
  <UCard>
    <template #header>
      <!-- Barre colorée en fonction de la discipline -->
      <div
        class="h-1.5"
        :class="[getDisciplineGradient(similarRecord.discipline.type)]"
      />
      <div class="p-2 flex items-center justify-between">
        <DisciplineBadge
          :type="similarRecord.discipline.type"
          size="xs"
          variant="subtle"
        />
        <UBadge
          v-if="similarRecord.isCurrentRecord"
          color="success"
          size="xs"
          variant="subtle"
          class="flex items-center gap-1"
        >
          <UIcon name="i-heroicons-trophy" class="h-3 w-3" />
          Actuel
        </UBadge>
      </div>
    </template>

    <div>
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-medium text-sm">{{ similarRecord.discipline.name }}</h3>
        <PerformanceDisplay
          :value="similarRecord.performance"
          :discipline-type="similarRecord.discipline.type"
          size="xs"
          variant="solid"
        />
      </div>
      <AthleteCard
        :athlete="similarRecord.athlete"
        :gender="similarRecord.genre"
        :avatar-url="getAthletePlaceholderImage(similarRecord.athlete)"
        compact
      />

      <USeparator class="my-2" />

      <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
        <UTooltip text="Date du record">
          <span class="flex items-center">
            <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5 mr-1" />
            {{ formatCompactDate(similarRecord.lastRecord) }}
          </span>
        </UTooltip>
        <UTooltip
          :text="similarRecord.genre === GenderType.MEN ? 'Homme' : 'Femme'"
        >
          <span class="flex items-center">
            <UIcon
              :name="
                similarRecord.genre === GenderType.MEN
                  ? 'i-heroicons-user'
                  : 'i-heroicons-user'
              "
              class="h-3.5 w-3.5 mr-1"
            />
            {{ similarRecord.genre === GenderType.MEN ? "H" : "F" }}
          </span>
        </UTooltip>
        <UTooltip :text="getCategoryLabel(similarRecord.categorie)">
          <span class="flex items-center">
            <UIcon name="i-heroicons-tag" class="h-3.5 w-3.5 mr-1" />
            {{ similarRecord.categorie }}
          </span>
        </UTooltip>
      </div>
    </div>

    <template #footer>
      <UButton color="primary" variant="ghost" size="xs" class="w-full">
        <template #leading>
          <UIcon name="i-heroicons-eye" class="h-4 w-4" />
        </template>
        Voir les détails
      </UButton>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { getAthletePlaceholderImage } from "#imports";
import {
  getDisciplineGradient,
  getCategoryLabel,
  formatCompactDate,
} from "@/utils/formaters";
import { GenderType } from "@/types";

defineProps({
  similarRecord: {
    type: Object,
    required: true,
  },
});
</script>

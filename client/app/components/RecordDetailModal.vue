<template>
  <UModal v-model="isOpen">
    <UCard v-if="record">
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold">Détails du record</h3>
          <UBadge v-if="record.isCurrentRecord" color="success" variant="soft">
            Record en cours
          </UBadge>
        </div>
      </template>
      
      <UDivider class="my-2" />
      
      <UDescriptionList :ui="{ term: { class: 'text-gray-600' } }">
        <UDescriptionListItem term="Discipline">
          <div class="font-medium">{{ record.discipline.name }}</div>
        </UDescriptionListItem>
        <UDescriptionListItem term="Type">
          <UBadge color="secondary" size="sm">{{ formatDisciplineType(record.discipline.type) }}</UBadge>
        </UDescriptionListItem>
        <UDescriptionListItem term="Catégorie">
          <UBadge color="primary" size="sm">{{ record.categorie }}</UBadge>
        </UDescriptionListItem>
        <UDescriptionListItem term="Genre">
          <UBadge :color="record.genre === 'M' ? 'primary' : 'secondary'" size="sm">
            {{ record.genre === 'M' ? 'Homme' : 'Femme' }}
          </UBadge>
        </UDescriptionListItem>
        <UDescriptionListItem term="Performance">
          <span class="font-mono text-lg font-medium">
            {{ formatPerformance(record.performance, record.discipline.type) }}
          </span>
        </UDescriptionListItem>
        <UDescriptionListItem term="Athlète">
          <div class="flex flex-col">
            <span class="font-medium">{{ record.athlete.firstname }} {{ record.athlete.lastname }}</span>
            <span class="text-gray-500 text-sm">{{ record.athlete.country }}</span>
          </div>
        </UDescriptionListItem>
        <UDescriptionListItem term="Date de naissance">
          {{ formatDate(record.athlete.birthdate) }}
        </UDescriptionListItem>
        <UDescriptionListItem term="Date du record">
          <div class="flex items-center">
            <UIcon name="i-heroicons-calendar" class="mr-2" />
            {{ formatDate(record.lastRecord) }}
          </div>
        </UDescriptionListItem>
        <UDescriptionListItem term="Lieu">
          <div class="flex items-center">
            <UIcon name="i-heroicons-map-pin" class="mr-2" />
            {{ record.location.name }}, {{ record.location.city }}, {{ record.location.country }}
          </div>
        </UDescriptionListItem>
      </UDescriptionList>
      
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton color="neutral" variant="soft" @click="close">
            Fermer
          </UButton>
          <UButton color="primary" :to="`/records/${record.id}`" icon="i-heroicons-arrow-top-right-on-square">
            Voir la page détaillée
          </UButton>
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { RecordEntity } from '../types';
import { DisciplineType } from '../types';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  record: {
    type: Object as () => RecordEntity | null,
    default: null
  }
});

const emit = defineEmits(['update:modelValue', 'close']);

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Fermer la modal
function close() {
  isOpen.value = false;
  emit('close');
}

// Formatage des types de discipline
function formatDisciplineType(type: DisciplineType): string {
  switch (type) {
    case DisciplineType.RUN:
      return 'Course';
    case DisciplineType.JUMP:
      return 'Saut';
    case DisciplineType.THROW:
      return 'Lancer';
    default:
      return String(type);
  }
}

// Formatage des performances selon le type de discipline
function formatPerformance(performance: number, disciplineType: DisciplineType | string): string {
  if (disciplineType === DisciplineType.RUN) {
    // Format time MM:SS.MS for running events
    const minutes = Math.floor(performance / 60);
    const seconds = Math.floor(performance % 60);
    const milliseconds = Math.round((performance % 1) * 100);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  } else {
    // Format distance in meters for jumps and throws
    return `${performance.toFixed(2)} m`;
  }
}

// Formatage des dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
</script>

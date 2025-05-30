<template>
  <UCard class="mb-6">
    <template #header>
      <div class="flex items-center justify-between">
        <h3 class="text-base font-semibold">Filtrer les records</h3>
        <UButton
          color="neutral"
          variant="ghost"
          size="sm"
          @click="toggleFiltersVisibility"
        >
          <template #leading>
            <UIcon name="heroicons:funnel" />
          </template>
          {{ isVisible ? "Masquer les filtres" : "Afficher les filtres" }}
        </UButton>
      </div>
    </template>

    <div v-if="isVisible" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Types de disciplines -->
        <MyFormGroup label="Type de discipline">
          <MySelect
            v-model="filtersModel.disciplineType"
            :items="disciplineOptions"
            placeholder="Sélectionner un type"
            size="sm"
            clearable
            aria-label="Type de discipline"
          >
            <template #leading>
              <UIcon name="heroicons:funnel" />
            </template>
          </MySelect>
        </MyFormGroup>

        <!-- Genres -->
        <MyFormGroup label="Genre">
          <MySelect
            v-model="filtersModel.gender"
            :items="genderOptions"
            placeholder="Sélectionner un genre"
            size="sm"
            clearable
            aria-label="Genre"
          >
            <template #leading>
              <UIcon name="heroicons:user" />
            </template>
          </MySelect>
        </MyFormGroup>

        <!-- Catégories -->
        <MyFormGroup label="Catégorie">
          <MySelect
            v-model="filtersModel.category"
            :items="categoryOptions"
            placeholder="Sélectionner une catégorie"
            size="sm"
            clearable
            aria-label="Catégorie"
          >
            <template #leading> <i class="pi pi-tag" /> </template>
          </MySelect>
        </MyFormGroup>

        <!-- Recherche par athlète -->
        <MyFormGroup label="Nom d'athlète">
          <UInput
            v-model="filtersModel.athleteName"
            placeholder="Rechercher un athlète"
            size="sm"
            clearable
            aria-label="Nom d'athlète"
            name="athleteName"
            autocomplete="off"
            class="w-full"
          >
            <template #leading>
              <UIcon name="heroicons:magnifying-glass" />
            </template>
          </UInput>
        </MyFormGroup>

        <!-- Période (années) -->
        <MyFormGroup label="Année (de)">
          <UInput
            v-model.number="filtersModel.yearFrom"
            type="number"
            placeholder="Ex: 2020"
            :min="1900"
            :max="currentYear"
            size="sm"
            clearable
            aria-label="Année (de)"
            name="yearFrom"
            autocomplete="off"
            class="w-full"
          />
        </MyFormGroup>

        <MyFormGroup label="Année (à)">
          <UInput
            v-model.number="filtersModel.yearTo"
            type="number"
            placeholder="Ex: 2025"
            :min="filtersModel.yearFrom || 1900"
            :max="currentYear"
            size="sm"
            clearable
            aria-label="Année (à)"
            name="yearTo"
            autocomplete="off"
            class="w-full"
          />
        </MyFormGroup>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue";
import type { RecordFilters } from "~/types";
import MyFormGroup from "./ui/MyFormGroup.vue";
import MySelect from "./ui/MySelect.vue";

const props = defineProps({
  /**
   * Les filtres actuels à afficher et modifier
   */
  modelValue: {
    type: Object as () => RecordFilters,
    required: true,
  },
  /**
   * Visibilité initiale des filtres
   */
  visible: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["update:modelValue", "update:visible"]);

// Année courante pour les filtres de date
const currentYear = new Date().getFullYear();

// État d'affichage des filtres
const isVisible = ref(props.visible);

// Modèle de filtres réactif
const filtersModel = reactive<RecordFilters>({ ...props.modelValue });

// Observer les changements du modelValue externe
watch(
  () => props.modelValue,
  (newValue) => {
    // Éviter les boucles infinies en comparant les valeurs avant de les assigner
    if (JSON.stringify(newValue) !== JSON.stringify(filtersModel)) {
      Object.assign(filtersModel, newValue);
    }
  },
  { deep: true, immediate: true },
);

// Mettre à jour le modèle lorsque les filtres internes changent
watch(
  filtersModel,
  (newValue) => {
    // Éviter les boucles infinies en comparant les valeurs avant d'émettre
    if (JSON.stringify(newValue) !== JSON.stringify(props.modelValue)) {
      emit("update:modelValue", { ...newValue });
    }
  },
  { deep: true },
);

// Options pour les selects
const disciplineOptions = [
  { label: "Toutes les disciplines", value: "all" },
  { label: "Courses", value: "run" },
  { label: "Sauts", value: "jump" },
  { label: "Lancers", value: "throw" },
];

const genderOptions = [
  { label: "Tous", value: "all" },
  { label: "Hommes", value: "M" },
  { label: "Femmes", value: "W" },
];

const categoryOptions = [
  { label: "Toutes", value: "all" },
  { label: "U18", value: "U18" },
  { label: "U20", value: "U20" },
  { label: "U23", value: "U23" },
  { label: "Senior", value: "SENIOR" },
  { label: "Master", value: "MASTER" },
];

// Fonction pour basculer la visibilité des filtres
function toggleFiltersVisibility() {
  isVisible.value = !isVisible.value;
  emit("update:visible", isVisible.value);
}
</script>

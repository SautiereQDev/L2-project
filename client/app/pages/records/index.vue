<template>
  <UContainer>
    <UPageHeader
        title="Records d'Athlétisme"
        description="Consultez les records d'athlétisme classés par discipline, genre et catégorie"
        :ui="{ title: 'font-bold text-2xl mb-4 text-primary-600 dark:text-primary-400' }"
    >
      <template #icon>
        <Icon name="heroicons:trophy" class="w-6 h-6 text-primary-500 dark:text-primary-400"/>
      </template>
    </UPageHeader>

    <!-- Composant de filtres -->
    <RecordsFilter
        :model-value="filters"
        :visible="showFilters"
        @update:model-value="newValue => Object.assign(filters, newValue)"
        @update:visible="showFilters = $event"
    />

    <!-- Composant liste des records -->
    <RecordsListCard
        :records="paginatedRecords"
        :loading="loading"
        :is-error="isError"
        :error="error"
        :sort-field="sortField"
        :sort-order="sortOrder"
        :total-items="totalItems"
        :total-pages="totalPages"
        :current-page="currentPage"
        @update:page="changePage"
        @refetch="refetch"
        @update:sort="sortBy"
        @show-details="showRecordDetails"
    />
  </UContainer>
</template>

<script setup lang="ts">
import {ref, reactive, computed, watch} from 'vue';
import {useQuery} from '@tanstack/vue-query';
import {useRoute, useRouter} from 'vue-router';
import type {RecordFilters, RecordEntity, CategorieType, GenderType} from '../../types';
import {DisciplineType} from '../../types';
import {compareValues} from '../../utils/comparison';
import {debounce} from '../../utils/debounce';
import authService from '../../services/auth.service';
import recordsService from '../../services/records.service';
import RecordsFilter from '@/components/RecordsFilter.vue';
import RecordsListCard from '@/components/RecordsListCard.vue';

// Récupérer la route pour extraire les paramètres d'URL
const route = useRoute();
const router = useRouter();

// Affichage des filtres
const showFilters = ref(true);

// Modal de détails
const modalOpen = ref(false);
const selectedRecord = ref<RecordEntity | null>(null);

// État de pagination
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = computed(() => Math.max(1, Math.ceil(filteredRecords.value.length / pageSize.value)));
const totalItems = computed(() => filteredRecords.value.length);

// État de tri
const sortField = ref<string>('discipline.name');
const sortOrder = ref<'asc' | 'desc'>('desc');

// État de filtre
const filters = reactive<RecordFilters>({
  disciplineType: 'all',
  gender: 'all',
  category: 'all',
  athleteName: '',
  yearFrom: undefined,
  yearTo: undefined
});

// Observer les changements dans les filtres
// Utiliser un debounce pour éviter les mises à jour trop fréquentes
const debouncedFilterUpdate = debounce(() => {
  // Ne pas mettre à jour si on est au milieu d'une réinitialisation
  if (filters.disciplineType === undefined) return;

  console.log('Filtres modifiés (debounced):', JSON.stringify(filters));
  // Revenir à la première page lors d'un changement de filtre
  currentPage.value = 1;
  // Mettre à jour les paramètres d'URL
  updateQueryParams();

  // Recalculer les filtres
  console.log('Recalcul des filtres après changement');
}, 300);

watch(filters, debouncedFilterUpdate, {deep: true});

// Stockage de toutes les données récupérées du serveur
const allRecords = ref<RecordEntity[]>([]);

// Mettre à jour les filtres depuis les paramètres d'URL après l'initialisation
onMounted(() => {
  // Initialiser les filtres par défaut
  filters.disciplineType = 'all';
  filters.gender = 'all';
  filters.category = 'all';

  // Remplacer par les valeurs des paramètres d'URL s'ils existent
  if (route.query.disciplineType) filters.disciplineType = route.query.disciplineType as DisciplineType;
  if (route.query.gender && (route.query.gender === 'M' || route.query.gender === 'W')) {
    filters.gender = route.query.gender as GenderType;
  }
  if (route.query.category) filters.category = route.query.category as CategorieType;
  if (route.query.athleteName) filters.athleteName = String(route.query.athleteName);
  if (route.query.yearFrom) filters.yearFrom = Number(route.query.yearFrom);
  if (route.query.yearTo) filters.yearTo = Number(route.query.yearTo);
  if (route.query.page) currentPage.value = Number(route.query.page);
});

// Utiliser TanStack Query pour récupérer toutes les données
const {
  data: records,
  isLoading: loading,
  isError,
  error,
  refetch
} = useQuery({
  queryKey: ['allRecords'],
  queryFn: async () => {
    try {
      // S'assurer que l'utilisateur est authentifié
      if (!authService.isAuthenticated()) {
        await authService.login({
          email: 'sautiereq@gmail.com',
          password: 'abcd1234'
        });
      }

      // Récupérer tous les records sans appliquer de filtres côté serveur
      const data = await recordsService.getRecords({
        itemsPerPage: 1000 // Un nombre suffisamment grand pour récupérer tous les records
      });

      // Stocker les données pour le filtrage local
      if (data && 'items' in data) {
        allRecords.value = data.items;
        return data;
      } else if (data && 'hydra:member' in (data as any)) {
        allRecords.value = (data as any)['hydra:member'];
        return data;
      } else {
        console.error('Format de réponse inattendu:', data);
        return {items: [], totalItems: 0};
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des records:', error);
      throw error;
    }
  },
  staleTime: 5 * 60 * 1000, // 5 minutes avant de considérer les données comme périmées
  refetchOnWindowFocus: false // Désactiver le refetch automatique en cas de changement de focus
});
// Forcer un refetch une fois que le composant est monté côté client
onMounted(() => {
  refetch();
});

// Synchroniser les filtres avec l'URL
function updateQueryParams() {
  // Ne conserver que les filtres non vides et différents de 'all'
  const queryParams: Record<string, string | number> = {};

  if (filters.disciplineType && filters.disciplineType !== 'all') queryParams.disciplineType = filters.disciplineType;
  if (filters.gender && filters.gender !== 'all') queryParams.gender = filters.gender;
  if (filters.category && filters.category !== 'all') queryParams.category = filters.category;
  if (filters.athleteName && filters.athleteName.trim() !== '') queryParams.athleteName = filters.athleteName;
  if (filters.yearFrom) queryParams.yearFrom = filters.yearFrom;
  if (filters.yearTo) queryParams.yearTo = filters.yearTo;
  if (currentPage.value > 1) queryParams.page = currentPage.value;

  // Remplacer les query params sans recharger la page
  router.replace({query: queryParams});
}

// Fonctions de filtres
function filterRecords(records: RecordEntity[]): RecordEntity[] {
  if (!records || !records.length) return [];

  // Normaliser les valeurs des filtres pour éviter les problèmes de comparaison
  const normalizedFilters = {
    disciplineType: filters.disciplineType || 'all',
    gender: filters.gender || 'all',
    category: filters.category || 'all',
    athleteName: (filters.athleteName || '').trim().toLowerCase(),
    yearFrom: filters.yearFrom || 0,
    yearTo: filters.yearTo || new Date().getFullYear() + 100
  };

  // Appliquer tous les filtres de manière concise
  return records.filter(record => {
    const recordYear = new Date(record.lastRecord).getFullYear();
    const fullName = `${record.athlete.firstname} ${record.athlete.lastname}`.toLowerCase();
    return (
        (normalizedFilters.disciplineType === 'all' || record.discipline.type === normalizedFilters.disciplineType) &&
        (normalizedFilters.gender === 'all' || record.genre === normalizedFilters.gender) &&
        (normalizedFilters.category === 'all' || record.categorie === normalizedFilters.category) &&
        (normalizedFilters.athleteName === '' || fullName.includes(normalizedFilters.athleteName)) &&
        (normalizedFilters.yearFrom === 0 || recordYear >= normalizedFilters.yearFrom) &&
        (normalizedFilters.yearTo === new Date().getFullYear() + 100 || recordYear <= normalizedFilters.yearTo)
    );
  });
}

// Fonction utilitaire pour obtenir une valeur imbriquée à partir d'un chemin de propriété
function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((o, p) => (o && o[p] !== undefined ? o[p] : null), obj);
}

// Fonction pour trier les records selon le champ sélectionné
function sortByField(records: RecordEntity[], field: string, order: 'asc' | 'desc'): RecordEntity[] {
  return [...records].sort((a, b) => {
    const aVal = getNestedValue(a, field);
    const bVal = getNestedValue(b, field);

    if (aVal === null || bVal === null) return 0;

    let comparison;
    if (field === 'performance') {
      // Pour les performances, la logique dépend du type de discipline
      if (a.discipline.type === DisciplineType.RUN) {
        // Pour les courses, les performances plus basses sont meilleures (temps)
        comparison = aVal - bVal;
      } else {
        // Pour les sauts et lancers, les performances plus élevées sont meilleures (distance)
        comparison = bVal - aVal;
      }
    } else if (typeof aVal === 'string') {
      comparison = aVal.localeCompare(bVal, undefined, {sensitivity: 'base'});
    } else if (aVal instanceof Date && bVal instanceof Date) {
      comparison = aVal.getTime() - bVal.getTime();
    } else {
      // Utilisation de la fonction compareValues pour éviter les problèmes ESLint
      comparison = compareValues(aVal, bVal);
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

// Computed property pour les records filtrés
const filteredRecords = computed(() => {
  // Capture explicitement toutes les dépendances pour garantir la réactivité
  const {
    disciplineType,
    gender,
    category,
    athleteName,
    yearFrom,
    yearTo
  } = filters;

  // Capture également les dépendances de tri
  const field = sortField.value;
  const order = sortOrder.value;

  // Appliquer les filtres aux records récupérés
  const filtered = filterRecords(allRecords.value);

  // Afficher les informations de filtrage (pour debugging)
  console.log(`Filtrage: ${filtered.length}/${allRecords.value.length} records correspondant aux filtres`, {
    disciplineType,
    gender,
    category,
    athleteName,
    yearFrom,
    yearTo
  });

  // Trier les résultats filtrés
  return sortByField(filtered, field, order);
});

// Computed property pour la pagination
const paginatedRecords = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredRecords.value.slice(startIndex, startIndex + pageSize.value);
});

// Fonction pour changer de page
function changePage(page: number) {
  currentPage.value = Math.min(Math.max(1, page), totalPages.value);
  updateQueryParams();
}

// Fonction pour trier via UTable
function sortBy(field: string, order: 'asc' | 'desc') {
  sortField.value = field;
  sortOrder.value = order;
  currentPage.value = 1;
  updateQueryParams();
}


// Fonction de filtrage supprimée car déplacée dans le composant RecordsFilter

// Afficher les détails d'un record
function showRecordDetails(record: RecordEntity) {
  selectedRecord.value = record;
  modalOpen.value = true;
}

// Fermer la modal
function closeModal() {
  modalOpen.value = false;
  setTimeout(() => {
    selectedRecord.value = null;
  }, 300); // Attendre que l'animation de fermeture soit terminée
}

// Note: Les fonctions de formatage ont été déplacées vers le composant RecordDetailModal
</script>
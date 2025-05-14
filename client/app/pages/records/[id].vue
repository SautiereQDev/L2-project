<!-- TODO: Utiliser nuxt leaflet pour creer la map -->
<!-- TODO: Utiliser node-i18n-iso-countries pour convertir les noms de pays de 2 lettres au pays entier + drapeau -->
<!-- TODO: Modifier les infos affichés pour qu'elles correspondent aux données stockés sur les records et les athlètes correspondants -->
<template>
  <UContainer>
    <!-- Gestion du mode chargement avec shimmer effect -->
    <template v-if="isLoading">
      <USkeleton class="h-12 w-3/4 max-w-md mb-8"/>
      <div class="grid gap-6 md:grid-cols-3 mb-8">
        <USkeleton v-for="i in 3" :key="i" class="h-64"/>
      </div>
      <USkeleton class="h-10 w-1/2 max-w-sm mb-4"/>
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <USkeleton v-for="i in 3" :key="i + 3" class="h-36"/>
      </div>
    </template>

    <!-- Si record non trouvé - Affichage avec illustration -->
    <UCard
        v-else-if="!record"
        class="my-12 max-w-md mx-auto text-center bg-gray-50 dark:bg-gray-900"
    >
      <template #header>
        <div class="flex flex-col items-center">
          <UIcon name="i-heroicons-document-search" class="h-20 w-20 text-gray-400 mb-2"/>
          <h2 class="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Record non trouvé
          </h2>
        </div>
      </template>

      <div class="text-gray-600 dark:text-gray-400 mb-6">
        Le record recherché n'a pas été trouvé ou n'existe plus dans notre base de données.
      </div>

      <template #footer>
        <div class="flex justify-center">
          <UButton
              color="primary"
              icon="i-heroicons-arrow-left"
              label="Retour aux records"
              block
              @click="router.push('/records')"
          />
        </div>
      </template>
    </UCard>

    <!-- Contenu principal si record existe -->
    <template v-else>
      <!-- Header avec nav, actions et partage -->
      <div class="mb-6">
        <UBreadcrumb :items="breadcrumbs" class="mb-4"/>


        <!-- Actions rapides -->
        <div class="flex items-center justify-between">
          <UButtonGroup class="mb-4">
            <UButton
                icon="i-heroicons-arrow-left"
                color="secondary"
                variant="soft"
                @click="router.push('/records')"
            />
            <UButton
                icon="i-heroicons-arrow-path"
                color="secondary"
                variant="soft"
                :loading="isRefetching"
                @click="refetch"
            />
          </UButtonGroup>

          <div class="flex gap-2">
            <SharePopover
                :title="record ? `Record: ${record.discipline.name}` : 'Record d\'athlétisme'"
                :url="currentUrl"
            />
            <div v-if="isAdmin" class="relative">
              <!-- Bouton pour ouvrir/fermer le menu -->
              <button
                  class="p-2 rounded-md text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700"
                  type="button"
                  aria-haspopup="true"
                  :aria-expanded="isAdminMenuOpen"
                  @click="toggleAdminMenu"
              >
                <UIcon name="i-heroicons-ellipsis-horizontal" class="h-5 w-5"/>
              </button>

            </div>
          </div>
        </div>
      </div>

      <!-- Hero section avec détails principaux du record -->
      <UCard
          class="mb-8 overflow-hidden"
      >
        <template #header>
          <div
              :class="[
            'w-full h-24 relative bg-gradient-to-r',
            getDisciplineGradient(record.discipline.type)
          ]">
            <div class="absolute inset-0 flex items-center justify-center">
              <UIcon
                  :name="getDisciplineIcon(record.discipline.type)"
                  class="text-white h-12 w-12 opacity-25 transform scale-150"
              />
            </div>

            <!-- Badge de record actuel -->
            <UBadge
                v-if="record.isCurrentRecord"
                color="success"
                variant="solid"
                size="sm"
                class="absolute top-3 right-3"
            >
              <template #leading>
                <UIcon name="i-heroicons-trophy" class="h-4 w-4"/>
              </template>
              Record en cours
            </UBadge>

            <!-- Performance -->
            <div
                class="absolute right-4 bottom-0 translate-y-1/2 bg-gray-700 dark:bg-gray-100 shadow-lg rounded-full p-2 border-2 border-white dark:border-gray-800">
              <PerformanceDisplay
                  :value="record.performance"
                  :discipline-type="record.discipline.type"
                  variant="solid"
                  size="xl"
                  class="px-4 py-1"
              />
            </div>
          </div>
        </template>

        <div class="pt-8 px-6 pb-4 relative">
          <!-- En-tête du record avec nom de la discipline -->
          <h1 class="text-2xl font-bold text-gray-700 dark:text-gray-200 flex items-center gap-2">
            {{ record.discipline.name }}
            <DisciplineBadge
                :type="record.discipline.type"
                variant="subtle"
                size="sm"
                class="ml-2"
            />
          </h1>

          <div class="mt-6 mb-6">
            <!-- Infos sur l'athlète -->
            <AthleteCard
                :athlete="record.athlete"
                :gender="record.genre"
                :avatar-url="getAthletePlaceholderImage(record.athlete)"
            />
          </div>

          <!-- Statistiques principales -->
          <USeparator class="my-4"/>
          <div class="grid grid-cols-3 gap-3">
            <div class="text-center rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
              <div class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Date</div>
              <div class="font-medium flex items-center justify-center gap-1">
                <UIcon name="i-heroicons-calendar" class="h-4 w-4 text-gray-400"/>
                {{ formatDate(record.lastRecord) }}
              </div>
            </div>
            <div class="text-center rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
              <div class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Catégorie</div>
              <UBadge color="secondary" variant="subtle" size="sm">
                {{ getCategoryLabel(record.categorie) }}
              </UBadge>
            </div>
            <div class="text-center rounded-lg bg-gray-50 dark:bg-gray-900 p-3">
              <div class="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 mb-1">Genre</div>
              <UBadge :color="record.genre === GenderType.MEN ? 'primary' : 'info'" variant="subtle" size="sm">
                {{ record.genre === GenderType.MEN ? 'Homme' : 'Femme' }}
              </UBadge>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Cards d'info détaillées -->
      <div class="grid md:grid-cols-2 gap-6 mb-8">
        <!-- Carte Athlète -->
        <UCard class="hover:shadow-lg transition-shadow">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-user-circle" class="h-5 w-5"/>
              <h3 class="text-lg font-semibold">Détails de l'Athlète</h3>
            </div>
          </template>

          <div class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</div>
              <div class="sm:col-span-2 font-medium">
                {{ record.athlete.firstname }} {{ record.athlete.lastname }}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Pays</div>
              <div class="sm:col-span-2 flex items-center gap-2">
                <span class="text-lg">{{ getCountryFlag(record.athlete.country) }}</span>
                {{ getCountryName(record.athlete.country) }}
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Date de naissance</div>
              <div class="sm:col-span-2 flex items-center gap-2">
                <span>{{ formatDate(record.athlete.birthdate) }}</span>
                <UBadge color="secondary" variant="subtle" size="xs">
                  {{ calculateAge(record.athlete.birthdate) }} ans
                </UBadge>
              </div>
            </div>
          </div>
        </UCard>

        <!-- Carte Lieu avec carte interactive -->
        <UCard class="hover:shadow-lg transition-all transform hover:-translate-y-1" :ui="{ body: 'p-0' }">
          <template #header>
            <div class="p-4 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <UIcon name="i-heroicons-map-pin" class="h-5 w-5 text-primary-600 dark:text-primary-400"/>
                <h3 class="text-lg font-semibold">Lieu du Record</h3>
              </div>
              <UButton
                  v-if="canDisplayMap"
                  color="primary"
                  variant="ghost"
                  size="xs"
                  :icon="showMap ? 'i-heroicons-minus-small' : 'i-heroicons-map'"
                  @click="toggleMapView"
              >
                {{ showMap ? 'Cacher la carte' : 'Voir sur la carte' }}
              </UButton>
            </div>
          </template>

          <div v-if="showMap && canDisplayMap" class="w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <!-- Carte interactive du lieu -->
            <RecordsMap
                :location-name="record.location.name"
                :city="record.location.city"
                :country="record.location.country"
                :lat="locationCoords?.lat"
                :lng="locationCoords?.lng"
                height="220px"
            />
          </div>

          <USeparator v-if="showMap && canDisplayMap"/>

          <div class="p-4">
            <div class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Stade/Lieu</div>
                <div class="sm:col-span-2 font-medium flex items-center">
                  <UIcon name="i-heroicons-building-library" class="h-4 w-4 text-gray-500 mr-2"/>
                  {{ record.location.name }}
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Ville</div>
                <div class="sm:col-span-2 flex items-center gap-2">
                  <UIcon name="i-heroicons-building-office-2" class="h-4 w-4 text-gray-500"/>
                  {{ record.location.city }}
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div class="text-sm font-medium text-gray-500 dark:text-gray-400">Pays</div>
                <div class="sm:col-span-2 flex items-center gap-2">
                  <span class="text-lg">{{ getCountryFlag(record.location.country) }}</span>
                  {{ getCountryName(record.location.country) }}
                </div>
              </div>
            </div>
          </div>

          <template v-if="canShowWeatherData" #footer>
            <div class="bg-gray-50 dark:bg-gray-900 p-3 rounded-b-lg">
              <div class="flex items||-center gap-1 mb-2">
                <UIcon name="i-heroicons-cloud" class="h-4 w-4 text-blue-500"/>
                <span class="text-sm font-medium">Conditions météo le jour du record</span>
              </div>
              <div class="grid grid-cols-3 gap-2 text-center">
                <div class="bg-white dark:bg-gray-800 rounded-md p-2">
                  <div class="text-xs text-gray-500 mb-1">Température</div>
                  <div class="font-medium flex items-center justify-center">
                    <UIcon name="i-heroicons-sun" class="h-4 w-4 text-amber-400 mr-1"/>
                    {{ weatherData?.temperature ?? '--' }}°C
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-md p-2">
                  <div class="text-xs text-gray-500 mb-1">Vent</div>
                  <div class="font-medium flex items-center justify-center">
                    <UIcon name="i-heroicons-arrow-right" class="h-4 w-4 text-blue-400 mr-1"/>
                    {{ weatherData?.wind ?? '--' }} m/s
                  </div>
                </div>
                <div class="bg-white dark:bg-gray-800 rounded-md p-2">
                  <div class="text-xs text-gray-500 mb-1">Humidité</div>
                  <div class="font-medium flex items-center justify-center">
                    <UIcon name="i-heroicons-beaker" class="h-4 w-4 text-blue-400 mr-1"/>
                    {{ weatherData?.humidity ?? '--' }}%
                  </div>
                </div>
              </div>
            </div>
          </template>
        </UCard>
      </div>

      <!-- Timeline de progression du record -->
      <UCard class="mb-8" :ui="{ body: 'p-0' }">
        <template #header>
          <div class="p-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-heroicons-chart-bar" class="h-5 w-5 text-primary-600 dark:text-primary-400"/>
              <h3 class="text-lg font-semibold">Évolution de la Performance</h3>
            </div>
            <UChip
                v-if="recordPeriodDuration > 0"
                color="primary"
                size="xs"
                class="rounded-full"
            >
              <UIcon name="i-heroicons-calendar" class="h-3 w-3 mr-1"/>
              {{ recordPeriodDuration }} jours
            </UChip>
          </div>
        </template>

        <div class="px-4 pb-2">
          <PerformanceChart
              :record-id="recordId"
              :discipline-type="record.discipline.type"
              :current-value="record.performance"
          />
        </div>

        <template #footer>
          <div class="bg-gray-50 dark:bg-gray-900 p-3 text-xs text-gray-500 text-center">
            <UIcon name="i-heroicons-information-circle" class="inline h-3 w-3 mr-1"/>
            L'évolution montre la progression de l'athlète sur cette discipline
          </div>
        </template>
      </UCard>

      <!-- Records similaires avec tabs pour filtrer -->
      <div v-if="groupedSimilarRecords.length" class="mb-8">
        <UCard class="overflow-visible">
          <template #header>
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
              <h2 class="text-xl font-semibold flex items-center gap-2">
                <UIcon name="i-heroicons-sparkles" class="h-5 w-5 text-amber-400"/>
                Records similaires
              </h2>

              <div class="flex gap-2 items-center border-b border-gray-200 dark:border-gray-800 pb-2">
                <UButton
                    v-for="tab in tabOptions"
                    :key="tab.name"
                    size="xs"
                    :color="similarRecordsTab === tab.name ? 'primary' : 'neutral'"
                    :variant="similarRecordsTab === tab.name ? 'solid' : 'ghost'"
                    @click="similarRecordsTab = tab.name as 'all' | 'same-discipline' | 'same-athlete'">
                  <template #leading>
                    <UIcon :name="tab.icon" class="h-3.5 w-3.5"/>
                  </template>
                  {{ tab.label }}
                  <UBadge
                      v-if="tab.count > 0"
                      size="xs"
                      color="secondary"
                      variant="subtle"
                      class="ml-1"
                  >
                    {{ tab.count }}
                  </UBadge>
                </UButton>
              </div>
            </div>
          </template>

          <!-- Transition entre les différents filtres -->
          <div class="min-h-[300px] mt-4">
            <transition name="fade" mode="out-in">
              <div v-if="filteredSimilarRecords.length" key="results" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <UCard
                    v-for="similarRecord in filteredSimilarRecords"
                    :key="similarRecord.id"
                    class="cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1 border border-gray-200 dark:border-gray-800 overflow-hidden"
                    @click="viewRecordDetails(similarRecord.id)"
                >
                  <template #header>
                    <!-- Barre colorée en fonction de la discipline -->
                    <div
                        class="h-1.5" :class="[
                      getDisciplineGradient(similarRecord.discipline.type)
                    ]"/>
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
                        <UIcon name="i-heroicons-trophy" class="h-3 w-3"/>
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

                    <USeparator class="my-2"/>

                    <div class="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
                      <UTooltip text="Date du record">
                        <span class="flex items-center">
                          <UIcon name="i-heroicons-calendar" class="h-3.5 w-3.5 mr-1"/>
                          {{ formatCompactDate(similarRecord.lastRecord) }}
                        </span>
                      </UTooltip>
                      <UTooltip :text="similarRecord.genre === GenderType.MEN ? 'Homme' : 'Femme'">
                        <span class="flex items-center">
                          <UIcon
                              :name="similarRecord.genre === GenderType.MEN ? 'i-heroicons-user' : 'i-heroicons-user'"
                              class="h-3.5 w-3.5 mr-1"/>
                          {{ similarRecord.genre === GenderType.MEN ? 'H' : 'F' }}
                        </span>
                      </UTooltip>
                      <UTooltip :text="getCategoryLabel(similarRecord.categorie)">
                        <span class="flex items-center">
                          <UIcon name="i-heroicons-tag" class="h-3.5 w-3.5 mr-1"/>
                          {{ similarRecord.categorie }}
                        </span>
                      </UTooltip>
                    </div>
                  </div>

                  <template #footer>
                    <UButton
                        color="primary"
                        variant="ghost"
                        size="xs"
                        class="w-full"
                    >
                      <template #leading>
                        <UIcon name="i-heroicons-eye" class="h-4 w-4"/>
                      </template>
                      Voir les détails
                    </UButton>
                  </template>
                </UCard>
              </div>

              <div v-else key="empty" class="text-center p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <UIcon name="i-heroicons-face-smile" class="h-12 w-12 mx-auto text-gray-400 mb-3"/>
                <h3 class="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">Aucun résultat</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">
                  Aucun record similaire ne correspond à ce filtre
                </p>
                <UButton
                    color="primary"
                    variant="outline"
                    class="mt-2"
                    @click="similarRecordsTab = 'all'"
                >
                  <UIcon name="i-heroicons-arrow-path" class="mr-1 h-4 w-4"/>
                  Voir tous les records
                </UButton>
              </div>
            </transition>
          </div>
        </UCard>
      </div>

      <!-- Section pour encourager la découverte d'autres records -->
      <UCard v-else class="mb-8 overflow-hidden">
        <template #header>
          <div class="bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 h-3"/>
        </template>

        <div class="text-center py-8">
          <div class="inline-flex p-4 rounded-full bg-amber-100 dark:bg-amber-900/30 mb-5">
            <UIcon name="i-heroicons-light-bulb" class="h-12 w-12 text-amber-500"/>
          </div>

          <h3 class="text-xl font-medium mb-3">Découvrez d'autres records !</h3>
          <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
            Il n'y a pas de records similaires à celui-ci actuellement.
            Explorez d'autres catégories ou disciplines pour découvrir des performances exceptionnelles !
          </p>

          <div class="flex gap-2 items-center border-b border-gray-200 dark:border-gray-800 pb-2">
            <UButton
                v-for="tab in tabOptions"
                :key="tab.name"
                size="xs"
                :color="similarRecordsTab === tab.name ? 'primary' : 'secondary'"
                :variant="similarRecordsTab === tab.name ? 'solid' : 'ghost'"
                @click="similarRecordsTab = tab.name as 'all' | 'same-discipline' | 'same-athlete'"
            >
              <template #leading>
                <UIcon :name="tab.icon" class="h-3.5 w-3.5"/>
              </template>
              {{ tab.label }}
              <UBadge
                  v-if="tab.count > 0"
                  size="xs"
                  color="secondary"
                  variant="subtle"
                  class="ml-1"
              >
                {{ tab.count }}
              </UBadge>
            </UButton>
          </div>
        </div>

        <template #footer>
          <div class="bg-gray-50 dark:bg-gray-800 p-3 text-center text-sm text-gray-500 dark:text-gray-400">
            Les nouveaux records sont ajoutés régulièrement - revenez bientôt !
          </div>
        </template>
      </UCard>
    </template>
  </UContainer>
</template>

<script setup lang="ts">
import {computed, ref, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useRecordDetail} from '@/composables/useRecordDetail';
import {useCountries} from '~/composables/useCountries'
import RecordsMap from "@/components/RecordsMap.vue";
import {CategorieType, GenderType, DisciplineType} from '@/types/record.types';

// Configuration de la page et validation
definePageMeta({
  layout: 'default',
  validate: (route) => {
    const id = Number(route.params.id);
    return !isNaN(id);
  },
  pageTransition: {
    name: 'page',
    mode: 'out-in'
  }
});

const { getCountryName, getCountryFlag } = useCountries()

// Router et paramètres
const route = useRoute();
const router = useRouter();
const recordId = Number(route.params.id);

// État local
const showMap = ref(false);
const isRefetching = ref(false);
const similarRecordsTab = ref<'all' | 'same-discipline' | 'same-athlete'>('all');

// Simulations de données pour l'exemple
const isAdmin = ref(false); // Dans une vraie app, utilisez composable useAuth
const weatherData = ref<{ temperature: number; wind: number; humidity: number } | null>(null);
const locationCoords = ref<{ lat: number; lng: number } | null>(null);
const isAdminMenuOpen = ref(false);


// Utiliser notre composable pour les détails du record
const {
  record,
  similarRecords,
  isLoading,
  isError,
  error,
  refetch
} = useRecordDetail(recordId);

// Charger les données simulées au montage du composant
onMounted(() => {
  // Simuler le chargement de données météo (uniquement pour l'exemple)
  setTimeout(() => {
    if (record.value) {
      weatherData.value = {
        temperature: Math.round(15 + Math.random() * 10),  // Entre 15 et 25°C
        wind: parseFloat((Math.random() * 3).toFixed(1)),  // Entre 0 et 3 m/s
        humidity: Math.round(40 + Math.random() * 40)      // Entre 40% et 80%
      };

      // Simuler les coordonnées pour la carte (uniquement pour l'exemple)
      locationCoords.value = {
        lat: 48.8566 + (Math.random() * 2 - 1),  // Proche de Paris (pour la démo)
        lng: 2.3522 + (Math.random() * 2 - 1)
      };
    }
  }, 1500);
});

// Calculer le fil d'Ariane
const breadcrumbs = computed(() => [
  {label: 'Accueil', to: '/'},
  {label: 'Records', to: '/records'},
  {
    label: record.value?.discipline.name ?? 'Détails',
    icon: getDisciplineIcon(record.value?.discipline.type ?? ''),
    to: route.path
  }
]);

// URL actuelle pour le partage
const currentUrl = computed(() => {
  return typeof window !== 'undefined' ? window.location.href : '';
});

const tabOptions = computed(() => [
  {
    name: 'all',
    label: 'Tous',
    icon: 'i-heroicons-squares-2x2',
    count: groupedSimilarRecords.value.length
  },
  {
    name: 'same-discipline',
    label: 'Même discipline',
    icon: getDisciplineIcon(record.value?.discipline.type ?? ''),
    count: sameDisciplineCount.value
  },
  {
    name: 'same-athlete',
    label: 'Même athlète',
    icon: 'i-heroicons-user',
    count: sameAthleteCount.value
  }
]);

// Grouper les records similaires pour les filtrer
const groupedSimilarRecords = computed(() => {
  if (!similarRecords.value || !record.value) return [];

  return similarRecords.value.map(r => ({
    ...r,
    sameDiscipline: r.discipline.type === record.value?.discipline.type,
    sameAthlete: r.athlete.id === record.value?.athlete.id
  }));
});

// Filtrer les records similaires selon l'onglet actif
const filteredSimilarRecords = computed(() => {
  switch (similarRecordsTab.value) {
    case 'same-discipline':
      return groupedSimilarRecords.value.filter(r => r.sameDiscipline);
    case 'same-athlete':
      return groupedSimilarRecords.value.filter(r => r.sameAthlete);
    case 'all':
    default:
      return groupedSimilarRecords.value;
  }
});

// Compter les records par filtre
const sameDisciplineCount = computed(() =>
    groupedSimilarRecords.value.filter(r => r.sameDiscipline).length
);

const sameAthleteCount = computed(() =>
    groupedSimilarRecords.value.filter(r => r.sameAthlete).length
);

// Vérifier si on peut afficher une carte
const canDisplayMap = computed(() => {
  return !!record.value?.location?.city;
});

// Vérifier si on peut afficher les données météo
const canShowWeatherData = computed(() => {
  return !!record.value && !!weatherData.value;
});

// Calculer la durée depuis la création du record jusqu'à aujourd'hui
const recordPeriodDuration = computed(() => {
  // Utiliser lastRecord (période du record)
  const dateValue = record.value?.lastRecord;
  if (!dateValue) return 0;

  const recordDate = new Date(dateValue);
  const today = new Date();

  // Calculer la différence en jours
  const diffTime = today.getTime() - recordDate.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
});

// Basculer l'affichage de la carte
function toggleMapView() {
  showMap.value = !showMap.value;
}

function toggleAdminMenu() {
  isAdminMenuOpen.value = !isAdminMenuOpen.value;
}

function handleAdminAction(option: { click: () => void, label: string, icon?: string }) {
  option.click();
  isAdminMenuOpen.value = false;
}

// Naviguer vers les détails d'un autre record
async function viewRecordDetails(id: number) {
  isRefetching.value = true;
  router.push(`/records/${id}`);
  await refetch();
  isRefetching.value = false;
  // Scroll en haut de la page
  window.scrollTo({top: 0, behavior: 'smooth'});
}

// Obtenir une image de profil placeholder pour un athlète
function getAthletePlaceholderImage(athlete: any): string {
  // Dans une vraie application, utilisez une véritable URL d'image
  const hash = athlete.lastname.charCodeAt(0) % 10;
  return `https://i.pravatar.cc/150?img=${hash}`;
}

// Calculer l'âge à partir d'une date de naissance
function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}

// Obtenir le gradient associé au type de discipline
function getDisciplineGradient(type: string): string {
  switch (type) {
    case DisciplineType.RUN:
      return 'from-blue-600 to-blue-400';
    case DisciplineType.JUMP:
      return 'from-yellow-600 to-yellow-400';
    case DisciplineType.THROW:
      return 'from-green-600 to-green-400';
    default:
      return 'from-gray-600 to-gray-400';
  }
}

// Obtenir l'icône associée au type de discipline
function getDisciplineIcon(type: string): string {
  switch (type) {
    case DisciplineType.RUN:
      return 'i-heroicons-bolt';
    case DisciplineType.JUMP:
      return 'i-heroicons-arrow-trending-up';
    case DisciplineType.THROW:
      return 'i-heroicons-hand-raised';
    default:
      return 'i-heroicons-trophy';
  }
}

// Convertir le type de discipline en libellé
function getDisciplineTypeLabel(type: string): string {
  const types: Record<string, string> = {
    'run': 'Course',
    'jump': 'Saut',
    'throw': 'Lancer'
  };

  return types[type] || type;
}

// Obtenir la couleur associée à une catégorie
function getCategoryColor(category: CategorieType): string {
  switch (category) {
    case CategorieType.U18:
      return 'u18';
    case CategorieType.U20:
      return 'u20';
    case CategorieType.U23:
      return 'u23';
    case CategorieType.SENIOR:
      return 'senior';
    case CategorieType.MASTER:
      return 'master';
    default:
      return 'primary';
  }
}

// Obtenir le label d'une catégorie
function getCategoryLabel(category: CategorieType): string {
  const categoryLabels: Record<CategorieType, string> = {
    'U18': 'Moins de 18 ans',
    'U20': 'Moins de 20 ans',
    'U23': 'Moins de 23 ans',
    'SENIOR': 'Senior',
    'MASTER': 'Master'
  };

  return categoryLabels[category] || category;
}

// Formatage des performances selon le type de discipline
function formatPerformance(performance: number, disciplineType: string): string {
  if (disciplineType === 'run') {
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

// Formatage des dates (format long)
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
}

// Formatage des dates (format compact)
function formatCompactDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit'
  }).format(date);
}
</script>
<template>
  <div class="athlete-card" :class="{ compact }">
    <!-- Affichage standard (non compact) -->
    <div v-if="!compact" class="flex items-center">
      <UAvatar
        :alt="`${athlete.firstname} ${athlete.lastname}`"
        :src="avatarUrl"
        size="lg"
        :placeholder="avatarInitials"
        class="mr-4 rounded-full bg-gray-100 dark:bg-gray-800"
        :class="
          gender === GenderType.MEN
            ? 'ring-2 ring-blue-500/50'
            : 'ring-2 ring-pink-500/50'
        "
      />
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-base font-medium">
            {{ athlete.firstname }} {{ athlete.lastname }}
          </h3>
          <UBadge
            v-if="showGender"
            :color="gender === GenderType.MEN ? 'male' : 'female'"
            variant="subtle"
            size="xs"
          >
            {{ gender === GenderType.MEN ? "H" : "F" }}
          </UBadge>
        </div>

        <div class="flex items-center text-sm text-gray-500 mt-1">
          <span v-if="showCountry" class="flex items-center">
            <span class="text-lg mr-1">{{ countryFlag }}</span>
            {{ getCountryName(athlete.country) }}
          </span>
          <UIcon
            v-if="showCountry && showAge"
            name="i-heroicons-circle-small"
            class="h-4 w-4 mx-1"
          />
          <span v-if="showAge">
            {{ calculateAge(athlete.birthdate) }} ans
          </span>
        </div>
      </div>
    </div>

    <!-- Affichage compact -->
    <div v-else class="flex items-center">
      <UAvatar
        :alt="`${athlete.firstname} ${athlete.lastname}`"
        :src="avatarUrl"
        size="sm"
        :placeholder="avatarInitials"
        class="mr-2 rounded-full bg-gray-100 dark:bg-gray-800"
        :class="
          gender === GenderType.MEN
            ? 'ring-1 ring-blue-500/50'
            : 'ring-1 ring-pink-500/50'
        "
      />
      <div class="leading-tight">
        <div class="font-medium text-sm">
          {{ athlete.firstname }} {{ athlete.lastname }}
        </div>
        <div class="text-xs text-gray-500 flex items-center">
          <span v-if="showCountry" class="text-sm mr-0.5">{{
            countryFlag
          }}</span>
          <span v-if="showAge" class="ml-0.5"
            >{{ calculateAge(athlete.birthdate) }} ans</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { GenderType } from "@/types/record.types";
import type { Athlete } from "@/types/record.types";
import { useCountries } from "@/composables/useCountries";

const props = defineProps({
  /**
   * Données de l'athlète
   */
  athlete: {
    type: Object as () => Athlete,
    required: true,
  },
  /**
   * Genre de l'athlète (par défaut, utilise celui de l'athlète)
   */
  gender: {
    type: String as () => GenderType,
    default: undefined,
  },
  /**
   * Affichage compact ou non
   */
  compact: {
    type: Boolean,
    default: false,
  },
  /**
   * Afficher le genre
   */
  showGender: {
    type: Boolean,
    default: false,
  },
  /**
   * Afficher le pays
   */
  showCountry: {
    type: Boolean,
    default: true,
  },
  /**
   * Afficher l'âge
   */
  showAge: {
    type: Boolean,
    default: true,
  },
  /**
   * URL de l'avatar (si non fourni, utilisera le placeholder)
   */
  avatarUrl: {
    type: String,
    default: "",
  },
});

const { getCountryFlag, getCountryName } = useCountries();

/**
 * Genre à utiliser (celui fourni en prop ou celui de l'athlète)
 */
const athleteGender = computed(() => props.gender || props.athlete.gender);

/**
 * Initiales pour l'avatar placeholder
 */
const avatarInitials = computed(() => {
  const firstName = props.athlete.firstname.charAt(0);
  const lastName = props.athlete.lastname.charAt(0);
  return `${firstName}${lastName}`;
});

/**
 * Emoji du drapeau du pays
 */
const countryFlag = computed(() => {
  return getCountryFlag(props.athlete.country);
});

/**
 * Calcule l'âge à partir de la date de naissance
 */
function calculateAge(birthdate: string): number {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  // Ajuster en fonction du mois et du jour
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}
</script>

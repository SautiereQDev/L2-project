<template>
  <div class="record-status" :class="statusClass">
    <div class="record-status__icon" :class="iconColor">
      <UIcon :name="icon" class="h-5 w-5" />
    </div>
    <div class="record-status__info">
      <div v-if="label" class="record-status__label">
        {{ label }}
      </div>
      <div class="record-status__timestamp">
        {{ formattedDate }}
      </div>
    </div>
    <UBadge
      v-if="showStatus"
      :color="badgeColor" 
      :variant="badgeVariant"
      size="sm"
      class="record-status__badge ml-auto"
    >
      {{ statusText }}
    </UBadge>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  /**
   * Date du record
   */
  date: {
    type: String,
    required: true
  },
  /**
   * Statut du record (actif, battu, etc.)
   */
  status: {
    type: String,
    default: 'active', // 'active', 'broken', 'pending'
    validator: (value: string) => ['active', 'broken', 'pending', 'historical'].includes(value)
  },
  /**
   * Libellé optionnel
   */
  label: {
    type: String,
    default: ''
  },
  /**
   * Format de date (long ou court)
   */
  dateFormat: {
    type: String,
    default: 'long', // 'long', 'short'
    validator: (value: string) => ['long', 'short'].includes(value)
  },
  /**
   * Afficher ou non le badge de statut
   */
  showStatus: {
    type: Boolean,
    default: true
  }
});

// Classe CSS globale pour le statut
const statusClass = computed(() => {
  return `record-status--${props.status}`;
});

// Couleur de l'icône selon le statut
const iconColor = computed(() => {
  switch (props.status) {
    case 'active': return 'text-success-500';
    case 'broken': return 'text-gray-400';
    case 'pending': return 'text-warning-500';
    case 'historical': return 'text-blue-500';
    default: return 'text-gray-500';
  }
});

// Icône selon le statut
const icon = computed(() => {
  switch (props.status) {
    case 'active': return 'i-heroicons-trophy';
    case 'broken': return 'i-heroicons-archive-box';
    case 'pending': return 'i-heroicons-clock';
    case 'historical': return 'i-heroicons-book-open';
    default: return 'i-heroicons-document';
  }
});

// Couleur du badge selon le statut
const badgeColor = computed(() => {
  switch (props.status) {
    case 'active': return 'success';
    case 'broken': return 'gray';
    case 'pending': return 'warning';
    case 'historical': return 'info';
    default: return 'gray';
  }
});

// Variante du badge selon le statut
const badgeVariant = computed(() => {
  switch (props.status) {
    case 'active': return 'solid';
    default: return 'subtle';
  }
});

// Texte du badge selon le statut
const statusText = computed(() => {
  switch (props.status) {
    case 'active': return 'Actuel';
    case 'broken': return 'Dépassé';
    case 'pending': return 'En validation';
    case 'historical': return 'Historique';
    default: return 'Inconnu';
  }
});

// Formater la date selon le format demandé
const formattedDate = computed(() => {
  const date = new Date(props.date);
  
  if (props.dateFormat === 'short') {
    // Format court (JJ/MM/YY)
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).format(date);
  } else {
    // Format long (JJ mois AAAA)
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  }
});
</script>

<style scoped>
.record-status {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}

.record-status--active {
  background-color: rgba(34, 197, 94, 0.1);
}

.record-status--broken {
  background-color: rgba(107, 114, 128, 0.1);
}

.record-status--pending {
  background-color: rgba(245, 158, 11, 0.1);
}

.record-status--historical {
  background-color: rgba(14, 165, 233, 0.1);
}

.record-status__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  background-color: rgba(255, 255, 255, 0.8);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.dark .record-status__icon {
  background-color: rgba(30, 41, 59, 0.8);
}

.record-status__info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.record-status__label {
  font-weight: 500;
  font-size: 0.875rem;
}

.record-status__timestamp {
  font-size: 0.75rem;
  color: rgba(107, 114, 128);
}

.dark .record-status__timestamp {
  color: rgba(156, 163, 175);
}

.record-status__badge {
  align-self: flex-start;
}
</style>

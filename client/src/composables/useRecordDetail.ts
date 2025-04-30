import { useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';
import recordsService from '../services/records.service';
import queryKeys from './queryKeys';

export function useRecordDetail(id: number) {
  // Requête pour récupérer les détails du record
  const recordQuery = useQuery({
    queryKey: queryKeys.records.detail(id),
    queryFn: () => recordsService.getRecord(id),
    staleTime: 5 * 60 * 1000, // 5 minutes avant d'être considéré comme obsolète
  });

  // Requête dépendante pour récupérer les records similaires (même discipline et même genre)
  const similarRecordsQuery = useQuery({
    queryKey: [...queryKeys.records.detail(id), 'similar'],
    queryFn: async () => {
      // Ne requêter que si on a les détails du record principal
      if (!recordQuery.data.value) {
        return [];
      }
      
      const record = recordQuery.data.value;
      
      // Récupérer les records de la même discipline et du même genre
      const filters = {
        disciplineType: record.discipline.type.toString(),
        gender: record.genre.toString(),
      };
      
      const records = await recordsService.getRecords(filters);
      
      // Exclure le record actuel des résultats
      return records.filter(r => r.id !== id);
    },
    enabled: computed(() => !!recordQuery.data.value), // Activer uniquement si on a les données du record
  });

  // Exposition des données et du statut
  return {
    // Données
    record: recordQuery.data,
    similarRecords: similarRecordsQuery.data,
    
    // États de chargement
    isLoading: computed(() => 
      recordQuery.isLoading.value || 
      (!!recordQuery.data.value && similarRecordsQuery.isLoading.value)
    ),
    isError: computed(() => recordQuery.isError.value || similarRecordsQuery.isError.value),
    error: computed(() => recordQuery.error.value || similarRecordsQuery.error.value),
    
    // Fonctions
    refetch: () => {
      recordQuery.refetch();
      if (recordQuery.data.value) {
        similarRecordsQuery.refetch();
      }
    },
  };
}

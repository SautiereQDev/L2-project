import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';
import recordsService from '../services/records.service';
import { queryKeys } from './useRecords';

export function useRecordDetails(recordId: number) {
  // Référence pour stocker l'ID du record
  const id = ref(recordId);
  
  // Requête pour obtenir les détails du record
  const recordQuery = useQuery({
    queryKey: queryKeys.records.byId(id.value),
    queryFn: () => recordsService.getRecord(id.value),
    enabled: !!id.value,
  });

  // Requête dépendante pour obtenir les records similaires
  // Cette requête s'exécute seulement lorsque les détails du record sont chargés
  const similarRecordsQuery = useQuery({
    queryKey: ['records', 'similar', id.value],
    queryFn: async () => {
      if (!recordQuery.data.value) {
        return [];
      }
      
      // Récupérer les records de la même discipline
      const record = recordQuery.data.value;
      return recordsService.getRecords({
        disciplineType: record.discipline.type,
      }).then(recordsCollection => 
        // Filtrer pour exclure le record actuel et limiter à 5 records similaires
        (recordsCollection.items || [])
          .filter(r => r.id !== id.value)
          .slice(0, 5)
      );
    },
    enabled: !!recordQuery.data.value,
  });

  // Fonction pour charger un record différent
  function loadRecord(newRecordId: number) {
    id.value = newRecordId;
  }

  return {
    record: recordQuery.data,
    similarRecords: similarRecordsQuery.data,
    isLoading: recordQuery.isPending,
    isError: recordQuery.isError,
    error: recordQuery.error,
    loadRecord,
    // Indiquer si les requêtes sont en cours
    isFetching: recordQuery.isFetching || similarRecordsQuery.isFetching,
  };
}

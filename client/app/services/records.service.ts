/**
 * Service pour gérer les requêtes de records
 */
import {apiClient} from './api';
import type {
  RecordEntity,
  RecordFilters,
  ApiCollection
} from '@/types';
import type {JsonLdCollection, HydraCollection} from '~/types/api.types';
import {normalizeHydraCollection} from '~/types/api.types';

export class RecordsService {
  /**
   * Récupère une liste de records avec filtres optionnels
   * @param filters - Critères de filtrage optionnels
   * @returns Promise<ApiCollection<RecordEntity>> - Collection de records avec pagination
   */
  async getRecords(filters: RecordFilters = {}): Promise<ApiCollection<RecordEntity>> {
    try {
      // Construire manuellement les query params pour support Hydra 'order[field]'
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) {
        if (value == null) continue;
        if (key === 'order' && typeof value === 'object') {
          for (const [field, dir] of Object.entries(value as Record<string, string>)) {
            params.append(`order[${field}]`, dir);
          }
        } else {
          params.append(key, String(value));
        }
      }
      const {data} = await apiClient.get<JsonLdCollection<RecordEntity> | HydraCollection<RecordEntity>>(
        'records',
        {params}
      );
      // Normaliser format Hydra vers ApiCollection
      return normalizeHydraCollection(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des records:', error);
      throw error;
    }
  }

  /**
   * Récupère un record spécifique par ID
   * @param id - ID du record à récupérer
   * @returns Promise<RecordEntity> - Le record demandé
   */
  async getRecord(id: number): Promise<RecordEntity> {
    try {
      const {data} = await apiClient.get<RecordEntity>(`/records/${id}`);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du record ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crée un nouveau record
   * @param record - Données partielles du record à créer
   * @returns Promise<RecordEntity> - Le record créé
   */
  async createRecord(record: Partial<RecordEntity>): Promise<RecordEntity> {
    try {
      const {data} = await apiClient.post<RecordEntity>('/records', record);
      return data;
    } catch (error) {
      console.error('Erreur lors de la création du record:', error);
      throw error;
    }
  }

  /**
   * Met à jour un record existant
   * @param id - ID du record à mettre à jour
   * @param record - Données partielles pour la mise à jour
   * @returns Promise<RecordEntity> - Le record mis à jour
   */
  async updateRecord(id: number, record: Partial<RecordEntity>): Promise<RecordEntity> {
    try {
      const {data} = await apiClient.put<RecordEntity>(`/records/${id}`, record);
      return data;
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du record ${id}:`, error);
      throw error;
    }
  }
}

export default new RecordsService();


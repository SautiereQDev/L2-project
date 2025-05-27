/**
 * Service pour gérer les requêtes de records
 */
import apiService from './api.service';
import type {
  RecordEntity,
  RecordFilters,
  ApiCollection
} from '../types';

export class RecordsService {
  /**
   * Récupère une liste de records avec filtres optionnels
   * @param filters - Critères de filtrage optionnels
   * @returns Promise<ApiCollection<RecordEntity>> - Collection de records
   */
  async getRecords(filters: RecordFilters = {}): Promise<ApiCollection<RecordEntity>> {
    try {
      // Convertir les filtres en paramètres d'API
      const params: Record<string, any> = this.prepareQueryParams(filters);

      console.log('Appel API avec filtres:', filters);

      // Utiliser la méthode get pour récupérer les données
      const response = await apiService.get<ApiCollection<RecordEntity>>('/records', params);

      console.log(`API a renvoyé ${response.items.length} records sur ${response.totalItems} au total`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des records:', error);
      throw error;
    }
  }

  /**
   * Prépare les paramètres de requête à partir des filtres
   * @param filters - Filtres pour la requête
   * @returns Record<string, any> - Paramètres formatés pour l'API
   */
  private prepareQueryParams(filters: RecordFilters): Record<string, any> {
    const params: Record<string, any> = {};

    // Ne traiter que les filtres non-vides
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params[key] = value;
      }
    });

    return params;
  }

  // Récupérer un record spécifique par ID - sans paramètres supplémentaires
  async getRecord(id: number): Promise<RecordEntity> {
    try {
      // Appel direct sans paramètres additionnels
      return await apiService.get<RecordEntity>(`/records/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération du record ${id}:`, error);
      throw error;
    }
  }

  // Créer un nouveau record
  async createRecord(record: Partial<RecordEntity>): Promise<RecordEntity> {
    return await apiService.post<RecordEntity>('/records', record);
  }

  // Mettre à jour un record
  async updateRecord(id: number, record: Partial<RecordEntity>): Promise<RecordEntity> {
    try {
      return await apiService.post<RecordEntity>(`/records/${id}`, record);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du record ${id}:`, error);
      throw error;
    }
  }
}

export default new RecordsService();
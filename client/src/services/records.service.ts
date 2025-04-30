/**
 * Service pour gérer les requêtes de records
 */
import apiService from './api.service';
import type { 
  RecordEntity, 
  RecordFilters, 
  CreateRecordDto,
  UpdateRecordDto,
  ApiCollection
} from '../types';
import { generateMockRecords } from './mock.service';

// Permet de basculer sur des données simulées en cas d'échec de l'API
const USE_API_FALLBACK = true;

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
      
      // Utiliser la méthode getCollection pour un typage correct
      const response = await apiService.getCollection<RecordEntity>('/records', params);
      
      console.log(`API a renvoyé ${response.items.length} records sur ${response.totalItems} au total`);
      return response;
    } catch (error) {
      console.error('Erreur lors de la récupération des records:', error);
      
      // Utiliser des données simulées en cas d'erreur si activé
      if (USE_API_FALLBACK) {
        console.log('Utilisation des données simulées en fallback');
        const mockRecords = generateMockRecords(15);
        return {
          items: mockRecords,
          totalItems: mockRecords.length,
          itemsPerPage: mockRecords.length,
          currentPage: 1,
          totalPages: 1
        };
      }
      
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
      
      if (USE_API_FALLBACK) {
        // Générer un record simulé avec l'ID spécifié
        const mockRecords = generateMockRecords(1);
        mockRecords[0].id = id;
        return mockRecords[0];
      }
      
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

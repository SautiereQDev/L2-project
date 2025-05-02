/**
 * Service pour gérer les requêtes de records
 */
import apiService from './api.service';
import type { 
  RecordEntity, 
  RecordFilters, 
  ApiCollection
} from '../types';
import { generateMockRecords } from './mock.service';

export const USE_API_FALLBACK = false;

export class RecordsService {

  /**
   * Récupère tous les records paginés depuis l'API, en respectant la pagination du backend.
   * @param filters - Critères de filtrage optionnels (sauf page/itemsPerPage)
   * @param itemsPerPage - Nombre d'éléments par page (défaut: 30)
   * @returns Promise<RecordEntity[]> - Tous les records concaténés
   */
  async  getAllRecords(
    filters: RecordFilters = {},
    itemsPerPage: number = 30
  ): Promise<RecordEntity[]> { 
    let allRecords: RecordEntity[] = [];
    let page = 1;
    let totalPages = 1;

    do {
      const response = await this.getRecords({ ...filters, page, itemsPerPage });
      allRecords = allRecords.concat(response.items);
      totalPages = response.totalPages;
      page++;
    } while (page <= totalPages);

    return allRecords;
  }
  /**
   * Récupère une liste de records avec filtres optionnels
   * @param filters - Critères de filtrage optionnels
   * @returns Promise<ApiCollection<RecordEntity>> - Collection de records
   */
  async getRecords(filters: RecordFilters = {}): Promise<ApiCollection<RecordEntity>> {
    // Convertir les filtres en paramètres d'API
    const params: Record<string, any> = this.prepareQueryParams(filters);

    console.log('Appel API avec filtres:', filters);

    // Utiliser la méthode get pour récupérer les données
    const response = await apiService.get<ApiCollection<RecordEntity>>('/records', params);

    console.log(`API a renvoyé ${response.items.length} records sur ${response.totalItems} au total`);
    return response;
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

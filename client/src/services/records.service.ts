// Service pour gérer les requêtes de records
import apiService from './api.service';
import type { RecordEntity, RecordFilters } from '../types';
import { generateMockRecords } from './mock.service';

// Permet de basculer sur des données simulées en cas d'échec de l'API
const USE_API_FALLBACK = true;

export class RecordsService {
  // Récupérer tous les records sans paramètres
  async getRecords(filters: RecordFilters = {}): Promise<RecordEntity[]> {
    try {
      // Ne pas envoyer de paramètres à l'API, comme demandé
      const params: Record<string, any> = {};
      
      console.log('Appel API sans paramètres, format JSON demandé');
      
      // Appel API sans paramètres (envoi d'un objet vide)
      const response = await apiService.get<any>('/records', {});
      
      // Si l'API renvoie une réponse structurée avec items
      if (response.items) {
        console.log(`API a renvoyé ${response.items.length} records sur ${response.totalItems} au total`);
        return response.items;
      }
      
      // Si l'API renvoie directement un tableau
      if (Array.isArray(response)) {
        return response;
      }
      
      throw new Error('Format de réponse API inattendu');
    } catch (error) {
      console.error('Erreur lors de la récupération des records:', error);
      
      // Utiliser des données simulées en cas d'erreur si activé
      if (USE_API_FALLBACK) {
        console.log('Utilisation des données simulées en fallback');
        return generateMockRecords(15);
      }
      
      throw error;
    }
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

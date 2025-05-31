/**
 * Service pour gérer les requêtes de records
 */
import { apiClient } from "./api";
import type { RecordEntity, RecordFilters, ApiCollection } from "~/types";
import type { JsonLdCollection, HydraCollection } from "~/types";
import { normalizeHydraCollection } from "~/types";

export class RecordsService {
  /**
   * Récupère une liste de records avec filtres optionnels
   * @param filters - Critères de filtrage optionnels
   * @returns Promise<ApiCollection<RecordEntity>> - Collection de records avec pagination
   */
  async getRecords(
    filters: RecordFilters = {},
  ): Promise<ApiCollection<RecordEntity>> {
    try {
      console.log("RecordsService - Appel API avec filtres:", filters);

      // Construire manuellement les query params pour support Hydra 'order[field]'
      const params = new URLSearchParams();

      // Ajouter les paramètres de pagination
      if (filters.page) {
        params.append("page", String(filters.page));
      }
      if (filters.itemsPerPage) {
        params.append("itemsPerPage", String(filters.itemsPerPage));
      }

      // Traitement des filtres spécifiques à l'API
      if (filters.disciplineType && filters.disciplineType !== "all") {
        params.append("discipline.type", filters.disciplineType);
      }

      if (filters.gender && filters.gender !== "all") {
        params.append("genre", filters.gender);
      }

      if (filters.category && filters.category !== "all") {
        params.append("categorie", filters.category);
      }

      // Recherche par nom d'athlète (firstname ou lastname)
      if (filters.athleteName) {
        // L'API utilise SearchFilter avec 'partial' pour ces champs
        params.append("athlete.lastname", filters.athleteName);
        // On pourrait également chercher par prénom, mais on garde une seule recherche
        // pour éviter les doublons dans les résultats
      }

      // Gestion du filtrage par année via lastRecord (DateFilter)
      if (filters.yearFrom) {
        params.append("lastRecord[after]", `${filters.yearFrom}-01-01`);
      }

      if (filters.yearTo) {
        params.append("lastRecord[before]", `${filters.yearTo}-12-31`);
      }

      // Traitement spécial pour le paramètre de tri
      if (filters.order && typeof filters.order === "object") {
        for (const [field, dir] of Object.entries(
          filters.order as Record<string, string>,
        )) {
          params.append(`order[${field}]`, dir);
        }
      }

      // S'assurer qu'un tri par défaut est toujours appliqué si aucun n'est spécifié
      if (!filters.order && !params.has("order[discipline.name]")) {
        params.append("order[discipline.name]", "asc");
      }

      console.log(
        "RecordsService - Paramètres URL:",
        Object.fromEntries(params.entries()),
      );

      try {
        const { data } = await apiClient.get<
          JsonLdCollection<RecordEntity> | HydraCollection<RecordEntity>
        >("records", { params });

        // Ajouter un log pour voir les données brutes reçues
        console.log("RecordsService - Données brutes reçues:", data);

        // Normaliser format Hydra vers ApiCollection
        const normalizedCollection = normalizeHydraCollection(data);
        console.log("RecordsService - Données normalisées:", normalizedCollection);
        
        return normalizedCollection;
      } catch (apiError) {
        console.error("Erreur API lors de la récupération des records:", apiError);
        // Retourner une collection vide en cas d'erreur pour éviter de bloquer l'interface
        return { items: [], totalItems: 0, currentPage: 1, totalPages: 1, pageSize: 10 };
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des records:", error);
      throw error;
    }
  }

  /**
   * Récupère un record spécifique par son ID
   * @param id - Identifiant unique du record à récupérer
   * @returns Promise<RecordEntity> - Le record correspondant à l'ID
   * @throws Error - Si le record n'est pas trouvé ou en cas d'erreur de requête
   */
  async getRecord(id: number): Promise<RecordEntity> {
    try {
      if (!id || id <= 0) {
        throw new Error("ID de record invalide");
      }

      console.log(`RecordsService - Récupération du record avec ID: ${id}`);

      const { data } = await apiClient.get<RecordEntity>(`records/${id}`);

      if (!data) {
        throw new Error(`Record avec ID ${id} non trouvé`);
      }

      return data;
    } catch (error) {
      console.error(`Erreur lors de la récupération du record ${id}:`, error);
      throw error;
    }
  }
}

export default new RecordsService();

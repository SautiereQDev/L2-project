/**
 * Service pour gérer les requêtes de records
 */
import { apiClient } from "./api";
import type { RecordEntity, RecordFilters, ApiCollection } from "@/types";
import type { JsonLdCollection, HydraCollection } from "~/types/api.types";
import { normalizeHydraCollection } from "~/types/api.types";

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

      const { data } = await apiClient.get<
        JsonLdCollection<RecordEntity> | HydraCollection<RecordEntity>
      >("records", { params });

      // Normaliser format Hydra vers ApiCollection
      return normalizeHydraCollection(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des records:", error);
      throw error;
    }
  }
}

export default new RecordsService();

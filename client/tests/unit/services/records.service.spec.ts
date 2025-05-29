import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Mock } from "vitest";
import recordsService, { RecordsService } from "@/services/records.service";
import apiService from "@/services/api.service";
import type { RecordEntity, ApiCollection, RecordFilters } from "~/types";

// Mock de l'apiService
vi.mock("@/services/api.service", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("RecordsService", () => {
  let service: RecordsService;

  // Données de test
  const mockRecord: RecordEntity = {
    id: 1,
    title: "Test Record",
    created_at: "2023-01-01",
  };

  const mockCollection: ApiCollection<RecordEntity> = {
    items: [mockRecord],
    totalItems: 1,
    page: 1,
    itemsPerPage: 10,
    totalPages: 1,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new RecordsService();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("getRecords", () => {
    it("récupèreTousLesRecordsSansFiltres", async () => {
      (apiService.get as Mock).mockResolvedValueOnce(mockCollection);

      const result = await service.getRecords();

      expect(result).toEqual(mockCollection);
      expect(apiService.get).toHaveBeenCalledWith("/records", {});
    });

    it("appliqueLesParamètresDeFiltrageCorrectement", async () => {
      const filters: RecordFilters = {
        search: "test",
        page: 2,
        limit: 20,
      };

      (apiService.get as Mock).mockResolvedValueOnce(mockCollection);

      await service.getRecords(filters);

      expect(apiService.get).toHaveBeenCalledWith("/records", {
        search: "test",
        page: 2,
        limit: 20,
      });
    });

    it("ignoreLesValeursDeFiltresVides", async () => {
      const filters: RecordFilters = {
        search: "",
        page: 1,
        limit: null as any,
        category: undefined,
      };

      (apiService.get as Mock).mockResolvedValueOnce(mockCollection);

      await service.getRecords(filters);

      expect(apiService.get).toHaveBeenCalledWith("/records", {
        page: 1,
      });
    });

    it("propageLerreurEnCasDÉchecDeRequête", async () => {
      const error = new Error("Erreur API");
      (apiService.get as Mock).mockRejectedValueOnce(error);

      await expect(async () => {
        await service.getRecords();
      }).rejects.toThrow("Erreur API");
    });
  });

  describe("getRecord", () => {
    it("récupèreUnRecordParSonIdentifiant", async () => {
      (apiService.get as Mock).mockResolvedValueOnce(mockRecord);

      const result = await service.getRecord(1);

      expect(result).toEqual(mockRecord);
      expect(apiService.get).toHaveBeenCalledWith("/records/1");
    });

    it("propageLerreurSiLeRecordNestPasTrouvé", async () => {
      const error = new Error("Record non trouvé");
      (apiService.get as Mock).mockRejectedValueOnce(error);

      await expect(async () => {
        await service.getRecord(999);
      }).rejects.toThrow("Record non trouvé");
    });
  });

  describe("createRecord", () => {
    it("crééUnNouveauRecordAvecSuccès", async () => {
      const newRecord: Partial<RecordEntity> = {
        title: "Nouveau Record",
      };

      (apiService.post as Mock).mockResolvedValueOnce({
        id: 2,
        ...newRecord,
        created_at: "2023-01-02",
      });

      const result = await service.createRecord(newRecord);

      expect(result).toEqual({
        id: 2,
        title: "Nouveau Record",
        created_at: "2023-01-02",
      });
      expect(apiService.post).toHaveBeenCalledWith("/records", newRecord);
    });

    it("propageLerreurEnCasDÉchecDeCréation", async () => {
      const error = new Error("Échec de création");
      (apiService.post as Mock).mockRejectedValueOnce(error);

      await expect(async () => {
        await service.createRecord({ title: "Test" });
      }).rejects.toThrow("Échec de création");
    });
  });

  describe("updateRecord", () => {
    it("metÀJourUnRecordExistant", async () => {
      const updateData: Partial<RecordEntity> = {
        title: "Titre Mis à Jour",
      };

      const updatedRecord = {
        id: 1,
        title: "Titre Mis à Jour",
        created_at: "2023-01-01",
        updated_at: "2023-01-03",
      };

      (apiService.post as Mock).mockResolvedValueOnce(updatedRecord);

      const result = await service.updateRecord(1, updateData);

      expect(result).toEqual(updatedRecord);
      expect(apiService.post).toHaveBeenCalledWith("/records/1", updateData);
    });

    it("propageLerreurEnCasDÉchecDeMiseÀJour", async () => {
      const error = new Error("Échec de mise à jour");
      (apiService.post as Mock).mockRejectedValueOnce(error);

      await expect(async () => {
        await service.updateRecord(1, { title: "Test" });
      }).rejects.toThrow("Échec de mise à jour");
    });
  });
});

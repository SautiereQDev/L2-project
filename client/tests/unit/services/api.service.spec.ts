import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { Mock } from "vitest";
import { ApiService } from "@/services/api.service";
import authService from "@/services/auth.service";

// Mock du service d'authentification
vi.mock("@/services/auth.service", () => ({
  default: {
    login: vi.fn(),
    isAuthenticated: vi.fn(),
    isTokenExpired: vi.fn(),
    getToken: vi.fn(),
  },
}));

// Mock global de fetch
global.fetch = vi.fn() as unknown as typeof fetch;

describe("ApiService", () => {
  let apiService: ApiService;

  beforeEach(() => {
    vi.clearAllMocks();
    apiService = new ApiService();

    // Configuration par défaut des mocks
    (authService.isAuthenticated as Mock).mockReturnValue(true);
    (authService.isTokenExpired as Mock).mockReturnValue(false);
    (authService.getToken as Mock).mockReturnValue("mock-token");
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("authenticate", () => {
    it("retourneVraiSiConnexionRéussie", async () => {
      (authService.login as Mock).mockResolvedValueOnce({
        success: true,
        data: { token: "token" },
      });

      const result = await apiService.authenticate(
        "email@test.com",
        "password",
      );

      expect(result).toBe(true);
      expect(authService.login).toHaveBeenCalledWith({
        email: "email@test.com",
        password: "password",
      });
    });

    it("retourneFauxSiConnexionÉchoue", async () => {
      (authService.login as Mock).mockResolvedValueOnce({
        success: false,
        message: "Échec",
      });

      const result = await apiService.authenticate(
        "email@test.com",
        "mauvais-mdp",
      );

      expect(result).toBe(false);
    });

    it("lancesUneErreurSiEchecAuthentication", async () => {
      (authService.isAuthenticated as Mock).mockReturnValue(false);
      (authService.login as Mock).mockResolvedValueOnce({
        success: false,
        message: "Échec de l'authentification",
      });

      await expect(apiService.get("/users/1")).rejects.toThrow(
        "Échec de l'authentification",
      );
    });

    it("gèreCorrectementLesErreursApiStructurées", async () => {
      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          success: false,
          message: "Validation échouée",
          errors: { name: ["Trop court"] },
        }),
      });

      // S'assurer que l'API Service utilise le message d'erreur retourné par l'API
      await expect(apiService.put("/users/1", { name: "A" })).rejects.toThrow(
        /Validation échouée/,
      );
    });
  });
});

/**
 * Service pour gérer les requêtes API
 * Fournit une interface type-safe pour communiquer avec le backend
 */
import authService from "./auth.service";

export class ApiService {
  /**
   * URL de base de l'API - utilise le proxy Vite configuré dans vite.config.ts
   */
  private readonly baseUrl: string = "/api";

  /**
   * Méthode pour effectuer une connexion et obtenir un token
   * @param email - Email de l'utilisateur
   * @param password - Mot de passe de l'utilisateur
   * @returns Promise<boolean> - true si authentification réussie, false sinon
   */
  async authenticate(email: string, password: string): Promise<boolean> {
    const response = await authService.login({ email, password });
    return !!response && !("error" in response);
  }

  /**
   * Vérifier si un token est disponible et valide, sinon tenter une connexion
   * @returns Promise<boolean> - true si l'authentification est valide
   */
  private async ensureAuthenticated(): Promise<boolean> {
    // Si nous ne sommes pas authentifiés ou si le token est expiré
    if (!authService.isAuthenticated() || authService.isTokenExpired()) {
      return await this.authenticate("sautiereq@gmail.com", "abcd1234");
    }
    return true;
  }

  /**
   * Méthode générique pour effectuer des requêtes GET
   * @param endpoint - Chemin de l'API sans la base URL
   * @param params - Paramètres de requête optionnels
   * @returns Promise<T> - Données typées retournées par l'API
   */
  async get<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    await this.ensureAuthenticated();
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    Object.keys(params).forEach(
      (key) =>
        params[key] != null &&
        url.searchParams.append(key, String(params[key])),
    );
    const authToken = authService.getToken();
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(
        `API GET Error: ${response.status} ${response.statusText}`,
      );
    return (await response.json()) as T;
  }

  /**
   * Méthode générique pour effectuer des requêtes POST
   * @param endpoint - Chemin de l'API sans la base URL
   * @param data - Données à envoyer dans le corps de la requête
   * @returns Promise<T> - Données typées retournées par l'API
   */
  async post<T>(endpoint: string, data: any): Promise<T> {
    await this.ensureAuthenticated();
    const url = `${this.baseUrl}${endpoint}`;
    const authToken = authService.getToken();
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(
        `API POST Error: ${response.status} ${response.statusText}`,
      );
    return (await response.json()) as T;
  }

  /**
   * Méthode générique pour effectuer des requêtes PUT
   * @param endpoint - Chemin de l'API sans la base URL
   * @param data - Données à envoyer dans le corps de la requête
   * @returns Promise<T> - Données typées retournées par l'API
   */
  async put<T>(endpoint: string, data: any): Promise<T> {
    await this.ensureAuthenticated();
    const url = `${this.baseUrl}${endpoint}`;
    const authToken = authService.getToken();
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!response.ok)
      throw new Error(
        `API PUT Error: ${response.status} ${response.statusText}`,
      );
    return (await response.json()) as T;
  }
}

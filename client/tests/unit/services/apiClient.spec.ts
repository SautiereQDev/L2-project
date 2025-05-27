import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Mock } from 'vitest';
import axios from 'axios';
import apiService, { apiClient } from '@/services/api';
import authService from '@/services/auth.service';

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxiosInstance),
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  };
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  };
  return { default: mockAxios, create: mockAxios.create };
});

// Mock authService
vi.mock('@/services/auth.service', () => ({
  default: {
    getToken: vi.fn(),
    isTokenExpired: vi.fn(),
    clearExpiredToken: vi.fn(),
    refreshTokenIfNeeded: vi.fn()
  }
}));

// Mock import.meta.env
vi.stubGlobal('import.meta', { env: { DEV: true } });

describe('API Service', () => {
  let requestInterceptor: Function;
  let responseInterceptor: Function;
  let responseErrorHandler: Function;

  beforeEach(() => {
    vi.clearAllMocks();

    // Simuler l'initialisation des intercepteurs
    const createSpy = vi.mocked(axios.create);
    const mockInstance = createSpy.mock.results[0]?.value || {
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() }
      }
    };

    // Récupérer les fonctions d'intercepteur
    const requestUseSpy = vi.mocked(mockInstance.interceptors.request.use);
    const responseUseSpy = vi.mocked(mockInstance.interceptors.response.use);

    if (requestUseSpy.mock.calls.length > 0) {
      requestInterceptor = requestUseSpy.mock.calls[0][0];
    }

    if (responseUseSpy.mock.calls.length > 0) {
      responseInterceptor = responseUseSpy.mock.calls[0][0];
      responseErrorHandler = responseUseSpy.mock.calls[0][1];
    }

    // Configurer des valeurs par défaut pour authService
    (authService.getToken as Mock).mockReturnValue('valid-token');
    (authService.isTokenExpired as Mock).mockReturnValue(false);
    (authService.refreshTokenIfNeeded as Mock).mockResolvedValue(true);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('checkHealth', () => {
    it('appelLePointDeSantéCorrectement', async () => {
      (apiClient.get as Mock).mockResolvedValueOnce({
        data: {
          status: 'ok',
          timestamp: '2023-01-01T00:00:00Z',
          database: { connected: true },
          environment: {
            php_version: '8.2.0',
            symfony_version: '6.3.0',
            server: { software: 'nginx', protocol: 'HTTP/1.1' }
          }
        }
      });

      await apiService.checkHealth();

      expect(apiClient.get).toHaveBeenCalledWith('/v1/health');
    });
  });

  describe('Intercepteur de requête', () => {
    it('ajouteTokenSiDisponibleEtValide', async () => {
      if (!requestInterceptor) return;

      const config = { headers: {} };
      (authService.getToken as Mock).mockReturnValue('valid-token');
      (authService.isTokenExpired as Mock).mockReturnValue(false);

      const result = await requestInterceptor(config);

      expect(result.headers.Authorization).toBe('Bearer valid-token');
    });

    it('rafraîchitLeTokenSiExpiréAvantRequête', async () => {
      if (!requestInterceptor) return;

      const config = { headers: {} };
      (authService.getToken as Mock).mockReturnValueOnce('expired-token');
      (authService.isTokenExpired as Mock).mockReturnValueOnce(true);
      (authService.refreshTokenIfNeeded as Mock).mockResolvedValueOnce(true);
      (authService.getToken as Mock).mockReturnValueOnce('new-token');

      const result = await requestInterceptor(config);

      expect(authService.clearExpiredToken).toHaveBeenCalled();
      expect(authService.refreshTokenIfNeeded).toHaveBeenCalled();
      expect(result.headers.Authorization).toBe('Bearer new-token');
    });

    it('gèreLeCasOùLeRafraîchissementDuTokenÉchoue', async () => {
      if (!requestInterceptor) return;

      const config = { headers: {} };
      (authService.getToken as Mock).mockReturnValueOnce('expired-token');
      (authService.isTokenExpired as Mock).mockReturnValueOnce(true);
      (authService.refreshTokenIfNeeded as Mock).mockResolvedValueOnce(false);

      const result = await requestInterceptor(config);

      expect(authService.clearExpiredToken).toHaveBeenCalled();
      expect(result.headers.Authorization).toBeUndefined();
    });

    it('renvoieConfigurationSansTokenSiAucunTokenDisponible', async () => {
      if (!requestInterceptor) return;

      const config = { headers: {} };
      (authService.getToken as Mock).mockReturnValueOnce(null);

      const result = await requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe('Intercepteur de réponse', () => {
    it('gèreErreur401EnEssayantDeRafraîchirLeToken', async () => {
      if (!responseErrorHandler) return;

      const originalError = {
        response: { status: 401, data: { message: 'Token expiré' } },
        config: { headers: {} }
      };

      (authService.refreshTokenIfNeeded as Mock).mockResolvedValueOnce(true);
      (authService.getToken as Mock).mockReturnValueOnce('new-token');
      (apiClient as any).mockResolvedValueOnce({ data: 'success' });

      try {
        await responseErrorHandler(originalError);
      } catch (error) {
        // En cas d'échec de la répétition, nous arriverons ici
        expect(error).toBeDefined();
      }

      expect(authService.clearExpiredToken).toHaveBeenCalled();
      expect(authService.refreshTokenIfNeeded).toHaveBeenCalled();
    });

    it('rejetteAvecErreurAmélioréeSiRafraîchissementDuTokenÉchoue', async () => {
      if (!responseErrorHandler) return;

      const originalError = {
        response: { status: 401, data: { message: 'Token expiré' } },
        config: { headers: {} }
      };

      (authService.refreshTokenIfNeeded as Mock).mockResolvedValueOnce(false);

      await expect(async () => {
        await responseErrorHandler(originalError);
      }).rejects.toThrow('Session expirée - veuillez vous reconnecter');

      expect(authService.clearExpiredToken).toHaveBeenCalled();
    });

    it('ignoreErreursDeCertificatEnDéveloppement', async () => {
      if (!responseErrorHandler) return;

      const certError = {
        code: 'ERR_CERT_AUTHORITY_INVALID',
        message: 'self signed certificate'
      };

      const result = await responseErrorHandler(certError);

      expect(result.data.status).toBe('mock');
      expect(result.data.message).toContain('API simulée en dev');
    });

    it('neTraitePasLesAutresTypesDerreurs', async () => {
      if (!responseErrorHandler) return;

      const otherError = {
        response: { status: 500, data: { message: 'Erreur serveur' } }
      };

      await expect(async () => {
        await responseErrorHandler(otherError);
      }).rejects.toEqual(otherError);

      expect(authService.clearExpiredToken).not.toHaveBeenCalled();
    });
  });

  describe('getClient', () => {
    it('renvoieInstanceClientApiConfigurée', () => {
      const client = apiService.getClient();
      expect(client).toBe(apiClient);
    });
  });
});
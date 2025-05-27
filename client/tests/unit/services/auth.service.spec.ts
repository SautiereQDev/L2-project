import {describe, it, expect, beforeEach, afterEach, vi} from 'vitest';
import type {Mock} from 'vitest';
import {authService} from '@/services/auth.service';
import {isTokenExpired, shouldRefreshToken, getTokenRemainingTime} from '@/utils/jwt.utils';

// Mock des fonctions JWT
vi.mock('@/utils/jwt.utils', () => ({
  isTokenExpired: vi.fn().mockReturnValue(false),
  shouldRefreshToken: vi.fn().mockReturnValue(false),
  getTokenRemainingTime: vi.fn().mockReturnValue(3600)
}));

// Mock de fetch
global.fetch = vi.fn() as unknown as typeof fetch;

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key: string) => {
      if (Object.prototype.hasOwnProperty.call(store, key)) {
        delete store[key];
      }
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

// Configurer localStorage via Object.defineProperty
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
  configurable: true
});

describe('authService', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();

    // Réinitialiser les mocks JWT avec des valeurs par défaut
    (isTokenExpired as Mock).mockReturnValue(false);
    (shouldRefreshToken as Mock).mockReturnValue(false);
    (getTokenRemainingTime as Mock).mockReturnValue(3600);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('login', () => {
    it('stockeLeTokenAprèsUneConnexionRéussie', async () => {
      const mockToken = 'jwt-token-test';
      const mockUser = {id: 1, email: 'test@example.com'};

      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {token: mockToken, user: mockUser}
        })
      });

      const result = await authService.login({email: 'test@example.com', password: 'password'});

      expect(result.success).toBe(true);
      expect(result?.data?.token).toBe(mockToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', mockToken);
      expect(authService.getToken()).toBe(mockToken);
    });

    it('gèreErreurDeConnexion', async () => {
      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Identifiants invalides',
          errors: {code: 401}
        })
      });

      const result = await authService.login({email: 'test@example.com', password: 'wrong'});

      expect(result.success).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('supprimeLesInformationsDeSession', () => {
      localStorageMock.setItem('auth_token', 'token-test');

      authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
      expect(authService.getToken()).toBeNull();
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('isAuthenticated', () => {
    it('retourneTrueSiTokenPrésentEtValide', () => {
      (isTokenExpired as Mock).mockReturnValue(false);
      localStorageMock.setItem('auth_token', 'token-valide');

      expect(authService.isAuthenticated()).toBe(true);
    });

    it('retourneFalseSiTokenAbsent', () => {
      localStorageMock.removeItem('auth_token');

      expect(authService.isAuthenticated()).toBe(false);
    });

    it('retourneFalseSiTokenExpiré', () => {
      (isTokenExpired as Mock).mockReturnValue(true);
      localStorageMock.setItem('auth_token', 'token-expiré');

      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getUserProfile', () => {
    it('récupèreLeProfilUtilisateurAvecSuccès', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User'
      };

      localStorageMock.setItem('auth_token', 'token-valide');

      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockUser
        })
      });

      const result = await authService.getUserProfile();

      expect(result).toEqual(mockUser);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/v1/me'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer token-valide'
          })
        })
      );
    });

    it('retourneNullSiAucunToken', async () => {
      localStorageMock.removeItem('auth_token');

      const result = await authService.getUserProfile();

      expect(result).toBeNull();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('gèreErreurDeLAPI', async () => {
      localStorageMock.setItem('auth_token', 'token-valide');

      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          message: 'Erreur serveur'
        })
      });

      const result = await authService.getUserProfile();

      expect(result).toBeNull();
    });
  });

  describe('refreshToken', () => {
    it('rafraîchitLeTokenAvecSuccès', async () => {
      const oldToken = 'token-ancien';
      const newToken = 'token-nouveau';

      localStorageMock.setItem('auth_token', oldToken);

      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {token: newToken}
        })
      });

      const result = await authService.refreshToken();

      expect(result.success).toBe(true);
      expect(result?.data?.token).toBe(newToken);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', newToken);
    });

    it('échoueSiAucunTokenInitial', async () => {
      localStorageMock.removeItem('auth_token');

      const result = await authService.refreshToken();

      expect(result.success).toBe(false);
      expect(result.message).toContain('Aucun token');
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('gèreErreurDuServeurLorsDuRafraîchissement', async () => {
      localStorageMock.setItem('auth_token', 'token-valide');

      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Token invalide'
        })
      });

      const result = await authService.refreshToken();

      expect(result.success).toBe(false);
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('refreshTokenIfNeeded', () => {
    it('neFaitRienSiTokenEstValideEtPasProcheDExpiration', async () => {
      localStorageMock.setItem('auth_token', 'token-valide');
      (isTokenExpired as Mock).mockReturnValue(false);
      (shouldRefreshToken as Mock).mockReturnValue(false);

      const result = await authService.refreshTokenIfNeeded();

      expect(result).toBe(true);
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('rafraîchitTokenSiBientôtExpiré', async () => {
      const oldToken = 'token-bientot-expiré';
      const newToken = 'token-nouveau';

      localStorageMock.setItem('auth_token', oldToken);
      (isTokenExpired as Mock).mockReturnValue(false);
      (shouldRefreshToken as Mock).mockReturnValue(true);

      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {token: newToken}
        })
      });

      const result = await authService.refreshTokenIfNeeded();

      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalled();
      expect(localStorageMock.setItem).toHaveBeenCalledWith('auth_token', newToken);
    });

    it('tenteDeSupprimerTokenSiComplètementExpiré', async () => {
      localStorageMock.setItem('auth_token', 'token-expiré');
      (isTokenExpired as Mock).mockReturnValue(true);

      // Échec du rafraîchissement
      (global.fetch as unknown as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          message: 'Token expiré'
        })
      });

      const result = await authService.refreshTokenIfNeeded();

      expect(result).toBe(false);
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('handleAuthError', () => {
    it('gèreAutomatiquementErreur401', async () => {
      const refreshSpy = vi.spyOn(authService, 'refreshTokenIfNeeded').mockResolvedValueOnce(true);

      const error = {code: 401, message: 'Expired JWT Token'};
      const result = await authService.handleAuthError(error);

      expect(result).toBe(true);
      expect(refreshSpy).toHaveBeenCalled();
    });

    it('forceReconnectionSiRafraîchissementÉchoue', async () => {
      const refreshSpy = vi.spyOn(authService, 'refreshTokenIfNeeded').mockResolvedValueOnce(false);
      const reconnectSpy = vi.spyOn(authService, 'forceReconnection').mockImplementation(() => {
      });

      const error = {code: 401, message: 'Expired JWT Token'};
      const result = await authService.handleAuthError(error);

      expect(result).toBe(true);
      expect(reconnectSpy).toHaveBeenCalled();
    });

    it('ignoreLesErreursDAutresTypes', async () => {
      const refreshSpy = vi.spyOn(authService, 'refreshTokenIfNeeded');

      const error = {code: 500, message: 'Server Error'};
      const result = await authService.handleAuthError(error);

      expect(result).toBe(false);
      expect(refreshSpy).not.toHaveBeenCalled();
    });
  });
});
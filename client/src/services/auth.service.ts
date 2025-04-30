// Service d'authentification et gestion du token JWT
import { ref } from 'vue';

interface AuthCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
}

// Utiliser le proxy Vite pour éviter les problèmes de certificat
const API_URL = '/api';
const authToken = ref<string | null>(null);

console.log("Service d'authentification initialisé");

export const authService = {
  // Connexion avec l'API d'authentification
  async login(credentials: AuthCredentials): Promise<boolean> {
    try {
      console.log('Authentification avec', credentials.email);
      
      // Utiliser le proxy Vite pour éviter les problèmes de certificat
      const response = await fetch(`${API_URL}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(credentials),
        cache: 'no-store',
      });

      if (!response.ok) {
        console.error(`Erreur d'authentification: ${response.status} ${response.statusText}`);
        return false;
      }

      const data = await response.json() as AuthResponse;
      
      if (!data?.token) {
        console.error('Token manquant dans la réponse');
        return false;
      }
      
      authToken.value = data.token;
      console.log('Token obtenu:', data.token.substring(0, 20) + '...');
      
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  },

  // Déconnexion
  logout(): void {
    authToken.value = null;
    localStorage.removeItem('auth_token');
  },

  // Vérifier si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    return !!authToken.value;
  },

  // Obtenir le token pour les requêtes API
  getToken(): string | null {
    return authToken.value;
  },

  // Vérifier si le token est expiré
  isTokenExpired(): boolean {
    if (!authToken.value) return true;
    
    // Vérifier si le token est un JWT valide
    try {
      // Extraire la partie payload du token JWT
      const payload = JSON.parse(atob(authToken.value.split('.')[1]));
      
      // Vérifier si l'expiration est définie
      if (!payload.exp) return false;
      
      // Comparer avec le timestamp actuel
      return payload.exp * 1000 < Date.now();
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'expiration du token:', error);
      return true;
    }
  },

  // Obtenir un nouveau token si le token actuel est expiré ou va expirer bientôt
  async refreshTokenIfNeeded(): Promise<boolean> {
    // Si le token est expiré ou va expirer dans moins de 5 minutes
    if (this.isTokenExpired()) {
      // Réessayer de se connecter avec les identifiants par défaut
      return await this.login({
        email: 'sautiereq@gmail.com',
        password: 'abcd1234'
      });
    }
    return true;
  }
};

export default authService;

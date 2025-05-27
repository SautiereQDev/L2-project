import { vi } from 'vitest';

// Mock du localStorage
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn()
  }
});

// Mock de fetch
global.fetch = vi.fn();

// Mock des composables Nuxt
vi.mock('#imports', () => ({
  useToast: vi.fn(() => ({
    add: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }))
}));

// Résolution du conflit d'import de useToast
vi.mock('@nuxt/ui', () => ({
  useToast: vi.fn(() => ({
    add: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn()
  }))
}));
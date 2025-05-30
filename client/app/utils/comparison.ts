// Fonction utilitaire pour comparer des valeurs et éviter les problèmes ESLint
export function compareValues(a: number, b: number) {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

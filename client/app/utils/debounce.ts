/**
 * Fonction de debounce pour limiter le nombre d'appels à une fonction
 * @param fn Fonction à exécuter
 * @param delay Délai en ms
 * @returns Fonction debounced
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>): void {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      fn(...args);
      timeout = null;
    }, delay);
  };
}

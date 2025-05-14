/**
 * Vérifie si les données sont un tableau non vide ou un objet avec une 
 * propriété 'items' ou 'members' qui est un tableau non vide
 */
export function hasMembers(data: unknown): boolean {
  // Vérifier si c'est directement un tableau
  if (Array.isArray(data)) {
    return data.length > 0;
  }
  
  // Vérifier si c'est un objet avec une propriété items (ApiCollection)
  if (data && typeof data === 'object' && 'items' in data && Array.isArray((data as any).items)) {
    return (data as any).items.length > 0;
  }
  
  // Vérifier si c'est un objet avec une propriété members (ancienne API)
  if (data && typeof data === 'object' && 'members' in data && Array.isArray((data as any).members)) {
    return (data as any).members.length > 0;
  }
  
  return false;
}

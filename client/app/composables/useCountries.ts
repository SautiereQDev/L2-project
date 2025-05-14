import countries from 'i18n-iso-countries'
import fr from 'i18n-iso-countries/langs/fr.json'

// Initialiser la langue française pour i18n-iso-countries
countries.registerLocale(fr)

/**
 * Composable pour la gestion des pays et drapeaux
 */
export function useCountries() {
  /**
   * Convertit un code ISO à 2 lettres en nom de pays complet
   * @param isoCode - Code ISO à 2 lettres du pays
   * @param locale - Locale pour le nom du pays (par défaut : fr)
   * @returns Nom complet du pays ou le code si non trouvé
   */
  const getCountryName = (isoCode: string, locale?: string): string => {
    if (!isoCode) return ''

    // Vérifier si le code est déjà un nom de pays
    if (isoCode.length > 2) return isoCode

    // Convertir en majuscules pour assurer la compatibilité
    const normalizedCode = isoCode.toUpperCase()
    return countries.getName(normalizedCode, locale ?? 'fr') ?? isoCode
  }

  /**
   * Obtient l'emoji de drapeau pour un code ISO à 2 lettres
   * @param isoCode - Code ISO à 2 lettres du pays
   * @returns Emoji du drapeau ou chaîne vide si non trouvé
   */
  const getCountryFlag = (isoCode: string): string => {
    if (!isoCode) return ''

    // Si c'est déjà un nom de pays, retourner un drapeau inconnu
    if (isoCode.length > 2) return '🏳️'

    // Convertir le code ISO en points de code Unicode pour les drapeaux
    // Les drapeaux sont formés en combinant les points de code régionaux (Regional Indicator Symbols)
    // qui commencent à U+1F1E6 (🇦) pour 'A' jusqu'à U+1F1FF (🇿) pour 'Z'
    const normalizedCode = isoCode.toUpperCase()
    const codePoints = [...normalizedCode].map(char =>
      127397 + char.charCodeAt(0)
    )

    try {
      return String.fromCodePoint(...codePoints)
    } catch (e) {
      console.error('Erreur lors de la conversion du code ISO en drapeau:', e)
      return '🏳️'
    }
  }

  /**
   * Obtient à la fois le nom et le drapeau d'un pays
   * @param isoCode - Code ISO à 2 lettres du pays
   * @param locale - Locale pour le nom du pays (par défaut : fr)
   * @returns Objet contenant le nom et le drapeau du pays
   */
  const getCountryInfo = (isoCode: string, locale = 'fr') => {
    return {
      name: getCountryName(isoCode, locale),
      flag: getCountryFlag(isoCode)
    }
  }

  return {
    getCountryName,
    getCountryFlag,
    getCountryInfo
  }
}
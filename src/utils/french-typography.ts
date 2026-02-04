/**
 * ═══════════════════════════════════════════════════════════════════════════
 * ORTHOTYPOGRAPHIE FRANÇAISE — RÈGLES ET TRANSFORMATIONS
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Ce module contient les règles d'orthotypographie française et les fonctions
 * de transformation de texte. Il est indépendant de tout framework.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * RÈGLES APPLIQUÉES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * 1. PONCTUATION HAUTE (signes doubles) : ; : ! ?
 *    → Espace fine insécable (U+202F) AVANT le signe
 *    → Espace normale APRÈS le signe
 *    Exemple : « Bonjour ! Comment allez-vous ? »
 *
 * 2. GUILLEMETS FRANÇAIS : « »
 *    → Espace fine insécable APRÈS le guillemet ouvrant «
 *    → Espace fine insécable AVANT le guillemet fermant »
 *    → Conversion automatique de << et >> vers « et »
 *    Exemple : « Voici une citation »
 *
 * 3. TIRETS TYPOGRAPHIQUES :
 *    → --- devient un tiret cadratin (—) pour les incises et dialogues
 *    → -- devient un tiret demi-cadratin (–) pour les intervalles
 *    Exemple : « Il dit — avec conviction — que... »
 *              « Pages 10–20 »
 *
 * 4. APOSTROPHE TYPOGRAPHIQUE :
 *    → L'apostrophe droite (') devient l'apostrophe courbe (')
 *    Exemple : « l'exemple » au lieu de « l'exemple »
 *
 * 5. POINTS DE SUSPENSION :
 *    → Trois points (...) deviennent le caractère unique (…)
 *    Exemple : « Et alors… »
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * TYPES D'ESPACES UTILISÉES
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * - Espace fine insécable (U+202F) :
 *   Utilisée avant ; : ! ? et autour des guillemets français.
 *   Plus étroite qu'une espace normale, elle évite que le signe
 *   de ponctuation se retrouve seul en début de ligne.
 *
 * - Espace insécable (U+00A0) :
 *   Utilisée dans certains contextes où une espace normale insécable
 *   est préférable (nombres et unités, abréviations, etc.).
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES TYPOGRAPHIQUES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Espace fine insécable (U+202F)
 * Utilisée avant les signes de ponctuation haute en français : ; : ! ?
 * et à l'intérieur des guillemets français « »
 *
 * Cette espace est plus étroite qu'une espace normale et empêche
 * le passage à la ligne entre le mot et le signe de ponctuation.
 */
export const ESPACE_FINE_INSECABLE = '\u202F'

/**
 * Espace insécable (U+00A0)
 * Utilisée pour lier des éléments qui ne doivent pas être séparés :
 * - Nombres et unités (10 km, 50 %, 100 €)
 * - Abréviations (n° 18, M. Dupont)
 * - Certains contextes où l'espace fine n'est pas appropriée
 */
export const ESPACE_INSECABLE = '\u00A0'

/**
 * Apostrophe typographique (U+2019)
 * Remplace l'apostrophe droite (') du clavier par l'apostrophe courbe
 * utilisée en typographie française soignée.
 */
export const APOSTROPHE_TYPOGRAPHIQUE = '\u2019'

/**
 * Tiret cadratin (U+2014)
 * Utilisé pour les incises, les dialogues et les listes.
 * Longueur : environ la largeur d'un « M » majuscule.
 */
export const TIRET_CADRATIN = '—'

/**
 * Tiret demi-cadratin (U+2013)
 * Utilisé pour les intervalles (pages 10–20, années 2020–2025)
 * et parfois pour les incises en typographie anglo-saxonne.
 */
export const TIRET_DEMI_CADRATIN = '–'

/**
 * Points de suspension (U+2026)
 * Caractère unique remplaçant trois points consécutifs.
 * Garantit un espacement correct et cohérent.
 */
export const POINTS_DE_SUSPENSION = '…'

/**
 * Guillemet ouvrant français (U+00AB)
 */
export const GUILLEMET_OUVRANT = '«'

/**
 * Guillemet fermant français (U+00BB)
 */
export const GUILLEMET_FERMANT = '»'

/**
 * Caractères qui ne doivent pas être suivis d'une espace fine
 * avant un signe de ponctuation (contextes techniques comme les URLs).
 */
const CARACTERES_EXCLUS_AVANT_PONCTUATION = [
  '/',
  ':',
  '&',
  '=',
  ESPACE_FINE_INSECABLE,
  ESPACE_INSECABLE,
]

// ═══════════════════════════════════════════════════════════════════════════
// FONCTION DE TRANSFORMATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Transforme une chaîne de caractères en appliquant les règles
 * d'orthotypographie française.
 *
 * @param texte - Le texte brut à transformer
 * @returns Le texte avec les corrections typographiques appliquées
 *
 * @example
 * transformerTexte("Bonjour! Comment ca va?")
 * // Retourne : "Bonjour ! Comment ça va ?"
 *
 * @example
 * transformerTexte("Il dit: <<C'est bien>>")
 * // Retourne : "Il dit : « C'est bien »"
 */
export function transformerTexte(texte: string): string {
  return texte
  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 1 : Caractères spéciaux
  // ─────────────────────────────────────────────────────────────────────

    // Points de suspension : ... → …
    .replace(/\.\.\./g, POINTS_DE_SUSPENSION)

    // Tiret cadratin : --- → —
    // Utilisé pour les incises et dialogues
    .replace(/---/g, TIRET_CADRATIN)

    // Tiret demi-cadratin : -- → –
    // Utilisé pour les intervalles (ex : 2020–2025)
    .replace(/--/g, TIRET_DEMI_CADRATIN)

    // Apostrophe typographique : ' → '
    .replace(/'/g, APOSTROPHE_TYPOGRAPHIQUE)

  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 2 : Guillemets français
  // ─────────────────────────────────────────────────────────────────────

    // Conversion << en « suivi d'une espace fine insécable
    .replace(/<<\s*/g, `${GUILLEMET_OUVRANT}${ESPACE_FINE_INSECABLE}`)

    // Conversion >> en » précédé d'une espace fine insécable
    .replace(/\s*>>/g, `${ESPACE_FINE_INSECABLE}${GUILLEMET_FERMANT}`)

    // Correction des espaces après le guillemet ouvrant existant
    // « texte → «␣texte (avec espace fine insécable)
    .replace(/«\s*/g, `${GUILLEMET_OUVRANT}${ESPACE_FINE_INSECABLE}`)

    // Correction des espaces avant le guillemet fermant existant
    // texte » → texte␣» (avec espace fine insécable)
    .replace(/\s*»/g, `${ESPACE_FINE_INSECABLE}${GUILLEMET_FERMANT}`)

  // ─────────────────────────────────────────────────────────────────────
  // ÉTAPE 3 : Ponctuation haute (signes doubles)
  // ─────────────────────────────────────────────────────────────────────

    // Remplacement des espaces existantes par des espaces fines insécables
    // avant les signes : ; : ! ? »
    .replace(/\s+([;:!?»])/g, `${ESPACE_FINE_INSECABLE}$1`)

    // Ajout d'une espace fine insécable si aucune espace n'existe
    // avant les signes : ; : ! ?
    .replace(/(\S)([;:!?])/g, (correspondance, caracterePrecedent, ponctuation) => {
      // Ne pas ajouter d'espace dans les contextes techniques
      // (URLs, paramètres de requête, etc.)
      if (CARACTERES_EXCLUS_AVANT_PONCTUATION.includes(caracterePrecedent)) {
        return correspondance
      }
      return `${caracterePrecedent}${ESPACE_FINE_INSECABLE}${ponctuation}`
    })
}

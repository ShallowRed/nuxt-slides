/**
 * Nuxt Plugin: French Typography
 *
 * Registers the v-french-typography directive globally in the Vue app.
 * The directive is automatically available in all components.
 *
 * @example
 * ```vue
 * <template>
 *   <main v-french-typography>
 *     <!-- All content will have proper French typography -->
 *   </main>
 * </template>
 * ```
 */

import { vFrenchTypography } from '~/directives/french-typography'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('french-typography', vFrenchTypography)
})

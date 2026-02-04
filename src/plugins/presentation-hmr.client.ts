/**
 * Client plugin to handle hot reload of presentation content
 * Listens for HMR events from the presentation-watcher Vite plugin
 */
export default defineNuxtPlugin(() => {
  if (import.meta.hot) {
    import.meta.hot.on('presentation-update', (data: { slug: string, filename: string }) => {
      const route = useRoute()
      
      // Check if we're on a slide page for this presentation
      if (route.path.startsWith('/slides/')) {
        const currentSlug = route.params.slug as string
        
        // If the changed file matches the current presentation, refresh
        if (data.slug === currentSlug || data.filename.includes(currentSlug)) {
          console.log(`🔄 Refreshing presentation: ${currentSlug}`)
          
          // Use refreshNuxtData to reload the presentation data
          refreshNuxtData(`presentation-${currentSlug}`)
        }
      }
    })
  }
})

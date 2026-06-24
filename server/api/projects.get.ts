import type { Project } from '#shared/projects'
import { listProjects } from '../utils/projects'

/**
 * Project registry endpoint — the catalog's grouping metadata (slug → title,
 * order, color) from `presentations/projects.yml`. Public: project labels are
 * not sensitive (the per-deck access gate still governs the decks themselves).
 */
export default defineEventHandler(async (): Promise<Project[]> => {
  try {
    return await listProjects()
  }
  catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
})

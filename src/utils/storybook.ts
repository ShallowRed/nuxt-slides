/**
 * Storybook embed helpers.
 *
 * A deck declares a single Storybook root in its frontmatter:
 *   storybook: http://localhost:6007
 *
 * Slides then reference a story by id (`<componentId>--<storyName>`) via the
 * `:layout{story="…"}` annotation or the `<StoryFrame story="…">` component.
 *
 * The implementations now live in the shared render layer (`shared/render`,
 * audit §5.9) so the live renderer, the frozen embed adapter, and tests share one
 * definition. Re-exported here for backward compatibility with `~/utils` imports.
 */

export type { StoryUrlOptions } from '#shared/render'
export { buildStoryUrl, EMBED_SANDBOX, resolveAspectRatio } from '#shared/render'

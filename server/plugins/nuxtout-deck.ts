/**
 * Turns a prerendered deck into a self-contained Reveal-only page (DDR-017 §2.a-ter),
 * when building a bundle (`BUNDLE_ONLY_SLUG`). The hydration-free HTML + inlined CSS
 * come from `features.noScripts`/`inlineStyles` (nuxt.config); this plugin only ADDS
 * what a standalone Reveal page needs — never strips tags. Reveal.js + the theme are
 * copied in by the Makefile.
 */

import process from 'node:process'
import { DEFAULT_REVEAL_CONFIG } from '../../src/config/presentation'

/**
 * Iframe scaler, inlined after Reveal.initialize (a separate <script src> is
 * detached by Reveal). Mirrors public/scaled-frame.js — reads each pane's client
 * size (cross-browser, unlike CSS `cqh` in Firefox) and sets the iframe transform.
 */
const INLINE_SCALER = `(function(){
var SEL='.slide-media-pane.is-scaled,.story-frame__media.is-scaled';
function m(p){var f=p.querySelector('iframe');if(!f)return;var w=p.clientWidth,h=p.clientHeight;if(!w||!h)return;
var pw=parseFloat(getComputedStyle(p).getPropertyValue('--preview-width'))||1440;var s=w/pw;
f.style.position='absolute';f.style.top='0';f.style.left='0';f.style.width=pw+'px';f.style.height=(s>0?h/s:h)+'px';
f.style.transform='scale('+s+')';f.style.transformOrigin='top left';}
var ro=typeof ResizeObserver!=='undefined'?new ResizeObserver(function(es){es.forEach(function(e){m(e.target)})}):null;
function scan(){document.querySelectorAll(SEL).forEach(function(p){m(p);if(ro){ro.observe(p);}});}
// Reveal.initialize() is async — retry via rAF until panes have a size, then rely
// on the ResizeObserver + Reveal events.
var tries=0;function tick(){scan();if(++tries<20){requestAnimationFrame(tick);}}
requestAnimationFrame(tick);
if(window.Reveal&&Reveal.on){Reveal.on('ready',scan);Reveal.on('slidechanged',scan);Reveal.on('resize',scan);}
})();`

export default defineNitroPlugin((nitroApp) => {
  if (!process.env.BUNDLE_ONLY_SLUG)
    return

  const theme = process.env.BUNDLE_THEME || 'lee'
  // The deck HTML is emitted at `slides/<slug>--standalone/index.html` — two dirs
  // below the bundle root, where `reveal/`, `_storybook/`, `themes/` and the asset
  // dirs live. Using a depth-relative prefix (not a root-absolute `/…` nor the
  // app base URL) makes the bundle location-agnostic: it works the same whether
  // served at `/frozen/<alias>/`, at the origin root, or moved anywhere.
  const prefix = '../..'

  // Reveal init config: prefer the per-deck config that RevealPresentation serialised
  // onto `.reveal[data-reveal-config]` (defaults merged with the deck frontmatter's
  // `reveal:` — margin, width, height). Falls back to DEFAULT_REVEAL_CONFIG only if
  // absent. Without this the bundle used default margins, visibly off vs the live app.
  const { autoPlayMedia, preloadIframes, ...defaultConfig } = DEFAULT_REVEAL_CONFIG
  const defaultInit = JSON.stringify(defaultConfig)
  const revealInitExpr
    = `(function(){var el=document.querySelector('.reveal[data-reveal-config]');`
      + `try{return el?JSON.parse(el.getAttribute('data-reveal-config')):${defaultInit};}`
      + `catch(e){return ${defaultInit};}})()`

  nitroApp.hooks.hook('render:html', (html) => {
    // Rebase the _nuxt/*.css link inlineStyles left in <head> (a composable CSS
    // import) so it resolves under the bundle, not the origin root.
    html.head = html.head.map(s => s.replace(/(href=")\/(_nuxt\/[^"]+\.css)/g, `$1${prefix}/$2`))

    html.head.push(
      `<link rel="stylesheet" href="${prefix}/reveal/reveal.css">`,
      `<link rel="stylesheet" href="${prefix}/themes/${theme}.css">`,
    )
    html.bodyAppend.push(
      `<script src="${prefix}/reveal/reveal.js"></script>`,
      `<script>Reveal.initialize(${revealInitExpr});\n${INLINE_SCALER}</script>`,
    )
    // Rebase the deck's own root-absolute asset URLs, keyed on the PATH TARGET not
    // the attribute name — so `src`, `href`, and the Reveal lightbox's
    // `data-preview-link` are all covered. Value rewriting only, never tag removal.
    const ASSET_DIRS = '_storybook|vitrine|fonts|images|backgrounds|geojson|icons|themes|documents|manifests'
    const re = new RegExp(`(=")/((?:${ASSET_DIRS})/[^"]*)`, 'g')
    html.body = html.body.map(chunk => chunk.replace(re, `$1${prefix}/$2`))
  })
})

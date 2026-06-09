import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{R as n,c as r,o as i}from"./blocks-DTDiUGvQ.js";import{t as a}from"./mdx-react-shim-ShZCXcPt.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,p:`p`,pre:`pre`,strong:`strong`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Design system/Fondations/Palette vitrine`}),`
`,`
`,(0,c.jsx)(t.h1,{id:`palette-vitrine`,children:`Palette vitrine`}),`
`,(0,c.jsxs)(t.p,{children:[`Quatre fonds canoniques + un fond thématique ponctuel. Le ton du texte est piloté automatiquement par la brique `,(0,c.jsx)(t.code,{children:`SectionVitrine`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`les-fonds-canoniques`,children:`Les fonds canoniques`}),`
`,(0,c.jsx)(l,{cls:`bg-dsfr-background-default-grey`,token:`--color-dsfr-background-default-grey`,hex:`#ffffff`,label:`Fond par défaut — page et sections principales (rôle « white »)`}),`
`,(0,c.jsx)(l,{cls:`bg-dsfr-background-alt-grey`,token:`--color-dsfr-background-alt-grey`,hex:`#f6f6f6`,label:`Alternance neutre (rôle « alt-grey »)`,badge:`alt 1`}),`
`,(0,c.jsx)(l,{cls:`bg-dsfr-background-alt-blue-france`,token:`--color-dsfr-background-alt-blue-france`,hex:`#f5f5fe`,label:`Alternance identitaire bleu pâle (rôle « alt-blue »)`,badge:`alt 2`}),`
`,(0,c.jsx)(l,{cls:`bg-dsfr-interactive-action-high-blue-france`,dark:!0,token:`--color-dsfr-background-action-high-blue-france`,hex:`#000091`,label:`Hero et panneau CTA fort (rôle « blue ») — texte blanc obligatoire`}),`
`,(0,c.jsx)(t.h2,{id:`fond-thématique-ponctuel`,children:`Fond thématique (ponctuel)`}),`
`,(0,c.jsxs)(t.p,{children:[`Une section peut être ponctuellement habillée d'une `,(0,c.jsx)(t.strong,{children:`teinte thématique pastel`}),` issue de la palette des thématiques (DDR-003).`]}),`
`,(0,c.jsx)(l,{cls:`#fef4f2`,token:`--thematique-bg`,hex:`valeur réelle injectée par ThematiqueScope`,label:`Exemple Figma node 2060:10039 — pastel posé via --thematique-bg, eyebrow en --thematique-main`}),`
`,(0,c.jsxs)(t.h2,{id:`usage-via-la-brique-sectionvitrine`,children:[`Usage via la brique `,(0,c.jsx)(t.code,{children:`SectionVitrine`})]}),`
`,(0,c.jsxs)(t.p,{children:[`Le rôle de fond est porté par la prop `,(0,c.jsx)(t.code,{children:`fond`}),` de `,(0,c.jsx)(t.code,{children:`SectionVitrine`}),`, qui résout la classe DSFR correspondante et impose le ton de texte adapté. Aucune classe `,(0,c.jsx)(t.code,{children:`fr-*`}),` structurelle n'est manipulée par le composant.`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-tsx`,children:`import { SectionVitrine } from '@vitrine/kit/briques/section-vitrine';
import { ThematiqueScope } from '@client/composants/shared/thematique-scope';

<main>
  <SectionVitrine fond="blue">Hero</SectionVitrine>
  <SectionVitrine fond="white">Contenu principal</SectionVitrine>
  <SectionVitrine fond="alt-grey">Alternance neutre</SectionVitrine>
  <SectionVitrine fond="alt-blue">Alternance identitaire</SectionVitrine>
  <ThematiqueScope etiquette={{ color1: t.color1, color2: t.color2 }}>
    <SectionVitrine fond="thematique" accent="var(--thematique-bg)">
      Section thématique « Jeunes » (ponctuelle)
    </SectionVitrine>
  </ThematiqueScope>
  <SectionVitrine fond="blue">Panneau CTA final</SectionVitrine>
</main>;
`})})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c,l;e((()=>{c=t(),a(),r(),l=({cls:e,token:t,hex:n,label:r,dark:i,badge:a})=>(0,c.jsxs)(`div`,{style:{marginBottom:`1.5rem`,borderRadius:`0.5rem`,overflow:`hidden`,border:`1px solid #e5e5e5`},children:[(0,c.jsx)(`div`,{className:e,style:{height:`4rem`,width:`100%`,background:e?.startsWith(`#`)?e:void 0}}),(0,c.jsxs)(`div`,{style:{padding:`0.75rem 1rem`,background:`#fff`},children:[(0,c.jsx)(`code`,{style:{fontWeight:700},children:e}),i&&(0,c.jsx)(`span`,{style:{marginLeft:`0.5rem`,fontSize:`0.75rem`,background:`#1e1e1e`,color:`#fff`,borderRadius:`0.25rem`,padding:`0.1rem 0.4rem`},children:`fond sombre`}),a&&(0,c.jsx)(`span`,{style:{marginLeft:`0.5rem`,fontSize:`0.75rem`,background:`#000091`,color:`#fff`,borderRadius:`0.25rem`,padding:`0.1rem 0.4rem`},children:a}),(0,c.jsx)(`br`,{}),(0,c.jsxs)(`span`,{style:{color:`#6b7280`,fontSize:`0.875rem`},children:[(0,c.jsx)(`code`,{children:t}),` → `,(0,c.jsx)(`code`,{children:n})]}),(0,c.jsx)(`br`,{}),(0,c.jsx)(`span`,{style:{color:`#6b7280`,fontSize:`0.875rem`},children:r})]})]})}))();export{l as Fond,s as default};
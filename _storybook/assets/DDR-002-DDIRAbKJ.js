import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{R as n,c as r,o as i}from"./blocks-DTDiUGvQ.js";import{t as a}from"./mdx-react-shim-ShZCXcPt.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,h3:`h3`,li:`li`,ol:`ol`,p:`p`,pre:`pre`,strong:`strong`,table:`table`,tbody:`tbody`,td:`td`,th:`th`,thead:`thead`,tr:`tr`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`DDR/DDR-002 : Couches de composition du design system`,created:`2026-05-13`,status:`accepté`}),`
`,(0,c.jsx)(t.h1,{id:`ddr-002--couches-de-composition-du-design-system`,children:`DDR-002 : Couches de composition du design system`}),`
`,(0,c.jsx)(t.h2,{id:`contexte`,children:`Contexte`}),`
`,(0,c.jsx)(t.p,{children:`L’application héberge aujourd’hui (en juin 2026) :`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`du code `,(0,c.jsx)(t.strong,{children:`vitrine`}),` sous DSFR global (≈ 260 composants dans `,(0,c.jsx)(t.code,{children:`src/client/vitrine/**`}),`) ;`]}),`
`,(0,c.jsxs)(t.li,{children:[`un `,(0,c.jsx)(t.strong,{children:`espace membre moderne`}),` sous Tailwind v4 + shadcn (pages `,(0,c.jsx)(t.code,{children:`src/app/(espace-membre)/espace-membre-v2/**`}),`, shell `,(0,c.jsx)(t.code,{children:`src/client/composants/espace-membre/*`}),`, primitives `,(0,c.jsx)(t.code,{children:`shadcn/components/ui/*`}),`) ;`]}),`
`,(0,c.jsxs)(t.li,{children:[`un dossier `,(0,c.jsx)(t.code,{children:`src/client/composants/design-system-V2/*`}),` `,(0,c.jsx)(t.strong,{children:`legacy`}),` (briques pré-shadcn d'un an, malgré le suffixe `,(0,c.jsx)(t.code,{children:`V2`}),`) ;`]}),`
`,(0,c.jsxs)(t.li,{children:[`du `,(0,c.jsx)(t.strong,{children:`legacy`}),` espace membre V1 sous DSFR + styled-components.`]}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Les frontières entre composant, composition et page sont implicites. Un même écran peut mélanger primitives shadcn, briques de `,(0,c.jsx)(t.code,{children:`composants/espace-membre/*`}),`, restes de `,(0,c.jsx)(t.code,{children:`design-system-V2/`}),`, sections métier et morceaux de pages historiques sans qu’il soit possible de dire à quelle couche chaque élément appartient. Cela rend le classement, la réutilisation et la migration coûteux.`]}),`
`,(0,c.jsx)(t.h2,{id:`décision`,children:`Décision`}),`
`,(0,c.jsxs)(t.ol,{start:`2`,children:[`
`,(0,c.jsxs)(t.li,{children:[`Le `,(0,c.jsx)(t.code,{children:`Design system`}),` est structuré en `,(0,c.jsx)(t.strong,{children:`4 couches de composition`}),`, reprises strictement comme préfixes de titre dans Storybook et comme axe de navigation dans la documentation.`]}),`
`]}),`
`,(0,c.jsxs)(t.table,{children:[(0,c.jsx)(t.thead,{children:(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.th,{children:`Couche`}),(0,c.jsx)(t.th,{children:`Contenu`}),(0,c.jsx)(t.th,{children:`Exemples`})]})}),(0,c.jsxs)(t.tbody,{children:[(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Fondations`}),(0,c.jsx)(t.td,{children:`Tokens, palettes, typographie, iconographie, thématiques`}),(0,c.jsx)(t.td,{children:`Palette vitrine, échelle d’espacement V2`})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Briques`}),(0,c.jsx)(t.td,{children:`Composants UI unitaires`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`PageHeader`}),`, `,(0,c.jsx)(t.code,{children:`PageContent`}),`, primitives `,(0,c.jsx)(t.code,{children:`shadcn/components/ui/*`})]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Compositions`}),(0,c.jsx)(t.td,{children:`Assemblages de briques`}),(0,c.jsxs)(t.td,{children:[(0,c.jsx)(t.code,{children:`EspaceMembrePageShell`}),`, `,(0,c.jsx)(t.code,{children:`AppSidebar`}),`, sections vitrine canoniques`]})]}),(0,c.jsxs)(t.tr,{children:[(0,c.jsx)(t.td,{children:`Modèles de page`}),(0,c.jsx)(t.td,{children:`Pages complèteds, équivalents visuels d’une route`}),(0,c.jsx)(t.td,{children:(0,c.jsx)(t.code,{children:`Webapp/Page événements (exemple)`})})]})]})]}),`
`,(0,c.jsxs)(t.p,{children:[`Chaque couche est susceptible d'être sous-divisées par `,(0,c.jsx)(t.strong,{children:`espace`}),`, avec éventuellement des dossiers de composants partagés :`]}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{children:`Briques
  ├─ Webapp/
  └─ Vitrine/

Compositions
   ├─ Webapp/
   └─ Vitrine/

Modèles de page
   ├─ Webapp/
   └─ Vitrine/
`})}),`
`,(0,c.jsx)(t.h2,{id:`critères-de-montée-dune-couche-à-la-suivante`,children:`Critères de montée d’une couche à la suivante`}),`
`,(0,c.jsx)(t.p,{children:`Les règles de classement ne dont pas rigides ou entièrement déterministes, il s'agit de faire preuve de bon sens, avec des heurisitiques comme :`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Un composant avec un slot nommé ou une API d’enfants typés est probablement une `,(0,c.jsx)(t.strong,{children:`composition`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Un composant qui consomme directement un type métier ou un store global est probablement une `,(0,c.jsx)(t.strong,{children:`composition`}),`.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Un composant qui assemble plusieurs compositions correspondant à une route ou un écran métier est certainement un `,(0,c.jsx)(t.strong,{children:`modèle de page`}),`.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`conséquences`,children:`Conséquences`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Chaque composant catalogué dans Storybook a un titre de la forme `,(0,c.jsx)(t.code,{children:`Couche/Espace/Composant`}),`.`]}),`
`,(0,c.jsx)(t.li,{children:`Un agent IA peut, à partir du chemin et du contenu du composant, proposer la couche d’appartenance correcte et signaler les ruptures de critères.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`alternatives-écartées`,children:`Alternatives écartées`}),`
`,(0,c.jsx)(t.h3,{id:`couches-atomiques-plus-fines-atomes--molécules--organismes-etc`,children:`Couches atomiques plus fines (atomes / molécules / organismes, etc.)`}),`
`,(0,c.jsx)(t.p,{children:`Le découpage en 4 couches (Fondations / Briques / Compositions / Modèles de page) est plus simple à appréhender et à appliquer que des sous-couches atomiques plus fines. Il est suffisamment granulaire pour différencier les niveaux de composition sans introduire de confusion ou de cas limites.`})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};
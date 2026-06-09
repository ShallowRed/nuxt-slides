import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{R as n,c as r,o as i}from"./blocks-DTDiUGvQ.js";import{t as a}from"./mdx-react-shim-ShZCXcPt.js";function o(e){let t={code:`code`,em:`em`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`DDR/DDR-000 : Qu’est-ce qu’un DDR`,created:`2026-05-13`,status:`accepté`}),`
`,(0,c.jsx)(t.h1,{id:`ddr-000--quest-ce-quun-ddr`,children:`DDR-000 : Qu’est-ce qu’un DDR`}),`
`,(0,c.jsx)(t.h2,{id:`contexte`,children:`Contexte`}),`
`,(0,c.jsx)(t.p,{children:`Le projet accumule depuis plusieurs années des couches de design et de pratiques de composition héritées (DSFR brut, design-system V1 sous DSFR, design-system V2, approche Tailwind seule, désormais shadcn également, code vitrine ad hoc). Les décisions qui ont structuré ces couches sont restées implicites : éparpillées dans des PR, des conversations, ou oubliées. Lorsqu’un nouveau composant ou une nouvelle page doit être conçue, l’absence de référent commun rend le choix de pattern coûteux et instable.`}),`
`,(0,c.jsx)(t.h2,{id:`décision`,children:`Décision`}),`
`,(0,c.jsxs)(t.p,{children:[`Toute décision de design qui a un impact durable sur la composition, l’ergonomie ou la sémantique visuelle de l’application est consignée comme un `,(0,c.jsx)(t.strong,{children:`DDR (Design Decision Record)`}),`, fichier Markdown versionné et publié dans un book afin d'être également accessible à tous les contributeurs.`]}),`
`,(0,c.jsx)(t.p,{children:`Chaque DDR suit le format suivant :`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Frontmatter YAML : `,(0,c.jsx)(t.code,{children:`title`}),`, `,(0,c.jsx)(t.code,{children:`created`}),`, `,(0,c.jsx)(t.code,{children:`status`}),` (`,(0,c.jsx)(t.code,{children:`proposé | accepté | déprécié | remplacé par DDR-XXX`}),`).`]}),`
`,(0,c.jsxs)(t.li,{children:[`Sections obligatoires : `,(0,c.jsx)(t.strong,{children:`Contexte`}),`, `,(0,c.jsx)(t.strong,{children:`Décision`})]}),`
`,(0,c.jsxs)(t.li,{children:[`Sections additionnelles possibles parmi : `,(0,c.jsx)(t.strong,{children:`Conséquences`}),`, `,(0,c.jsx)(t.strong,{children:`Alternatives écartées`}),`, etc.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Nommage : `,(0,c.jsx)(t.code,{children:`ddr-NNN-titre-court.md`}),` (numérotation séquentielle, jamais réutilisée).`]}),`
`,(0,c.jsx)(t.li,{children:`Pas de préfixe d'espace : un DDR vitrine et un DDR transverse partagent la même séquence.`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Les DDR sont la `,(0,c.jsx)(t.strong,{children:`mémoire décisionnelle`}),` du design system. Ils ne décrivent pas l'existant, ni la progression de tâches ou migrations. Ils décrivent `,(0,c.jsx)(t.em,{children:`ce que l'on applique à partir de maintenant et pourquoi`}),`.`]}),`
`,(0,c.jsx)(t.h2,{id:`conséquences`,children:`Conséquences`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`Une règle de design n'est opposable que si elle est portée par un DDR. À défaut, c'est une opinion individuelle, pas une doctrine du projet.`}),`
`,(0,c.jsxs)(t.li,{children:[`Chaque DDR est exposé dans Storybook sous `,(0,c.jsx)(t.code,{children:`DDR/`})]}),`
`,(0,c.jsx)(t.li,{children:`Une PR qui introduit un pattern de composition non couvert par un DDR existant produit soit un nouveau DDR, soit une révision d'un DDR existant.`}),`
`,(0,c.jsxs)(t.li,{children:[`Une PR peut citer un DDR pour justifier un choix de pattern (`,(0,c.jsx)(t.code,{children:`cf. DDR-001`}),`).`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`frontière-ddr--adr`,children:`Frontière DDR ↔ ADR`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Un `,(0,c.jsx)(t.strong,{children:`ADR`}),` couvre les arbitrages de stack, d'infrastructure, les choix techniques structurants, etc.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Un `,(0,c.jsx)(t.strong,{children:`DDR`}),` couvre un pattern d’interaction, une sémantique visuelle, de composition, etc.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`ce-qui-mérite-un-ddr`,children:`Ce qui mérite un DDR`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`Un pattern d’interaction pour lequel plusieurs options valides existent.`}),`
`,(0,c.jsx)(t.li,{children:`Une convention de composition avec des frontières non triviales.`}),`
`,(0,c.jsx)(t.li,{children:`Une décision sémantique avec impact accessibilité ou cohérence multi-écrans.`}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`ce-qui-ne-mérite-pas-un-ddr`,children:`Ce qui ne mérite pas un DDR`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`Une décision réversible sans coût (libellé d’un bouton, couleur précise d’un état).`}),`
`,(0,c.jsx)(t.li,{children:`Un détail purement technique (nom d’une prop, type TypeScript).`}),`
`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};
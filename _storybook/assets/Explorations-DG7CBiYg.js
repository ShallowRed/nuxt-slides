import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{R as n,c as r,o as i}from"./blocks-DTDiUGvQ.js";import{t as a}from"./mdx-react-shim-ShZCXcPt.js";function o(e){let t={code:`code`,h1:`h1`,h2:`h2`,li:`li`,p:`p`,pre:`pre`,strong:`strong`,ul:`ul`,...n(),...e.components};return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(i,{title:`Explorations/Introduction`,tags:[`!manifest`]}),`
`,(0,c.jsx)(t.h1,{id:`explorations`,children:`Explorations`}),`
`,(0,c.jsxs)(t.p,{children:[`Cette couche accueille des `,(0,c.jsx)(t.strong,{children:`prototypes prospectifs`}),` : maquettes haute-fidélité d'un parcours futur, ateliers, pistes encore en discussion. Elle est volontairement tenue à l'écart du design system stabilisé.`]}),`
`,(0,c.jsx)(t.h2,{id:`ce-qui-distingue-une-exploration`,children:`Ce qui distingue une exploration`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Statut prospectif.`}),` Ce qui s'y trouve peut être abandonné, remanié ou promu vers du stabilisé une fois établi. Un écran d'exploration n'est pas une référence d'implémentation.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Composants non catalogués.`}),` Une exploration peut assembler des composants ad hoc, si le besoin de la maquette l'exige.`]}),`
`,(0,c.jsxs)(t.li,{children:[(0,c.jsx)(t.strong,{children:`Code co-localisé à Storybook.`}),` Une exploration ne doit pas réintroduire un arbre parallèle dans `,(0,c.jsx)(t.code,{children:`src/app`}),` ou `,(0,c.jsx)(t.code,{children:`apps/web/src/app`}),` tant qu'elle n'est pas assumée comme fonctionnalité produit.`]}),`
`]}),`
`,(0,c.jsx)(t.h2,{id:`organisation-des-explorations`,children:`Organisation des explorations`}),`
`,(0,c.jsxs)(t.p,{children:[`Les explorations sont regroupées par `,(0,c.jsx)(t.strong,{children:`sujet`}),`.`]}),`
`,(0,c.jsx)(t.p,{children:`Un sujet d'exploration peut contenir, selon son niveau de maturité :`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsx)(t.li,{children:`une ou plusieurs stories d'entrée, qui exposent les écrans ou variantes depuis la sidebar Storybook ;`}),`
`,(0,c.jsxs)(t.li,{children:[`un sous-dossier de `,(0,c.jsx)(t.strong,{children:`prototype`}),` pour le code local à l'exploration ;`]}),`
`,(0,c.jsxs)(t.li,{children:[`des sous-dossiers `,(0,c.jsx)(t.code,{children:`page/`}),`, `,(0,c.jsx)(t.code,{children:`components/`}),`, `,(0,c.jsx)(t.code,{children:`data/`}),` quand plusieurs écrans partagent un shell, des helpers ou des fixtures ;`]}),`
`,(0,c.jsxs)(t.li,{children:[`des imports vers des briques stabilisées de `,(0,c.jsx)(t.code,{children:`apps/web`}),` quand cela permet de prototyper sur la vraie base UI sans dupliquer le design system.`]}),`
`]}),`
`,(0,c.jsx)(t.p,{children:`Exemple de structure souple :`}),`
`,(0,c.jsx)(t.pre,{children:(0,c.jsx)(t.code,{className:`language-text`,children:`explorations/
	mon-sujet/
		MonSujet.stories.tsx
		prototype/
			page/
			components/
			data/
`})}),`
`,(0,c.jsxs)(t.p,{children:[`Cette structure n'est `,(0,c.jsx)(t.strong,{children:`pas rigide`}),` : certaines explorations tiendront dans une seule story, d'autres auront besoin d'un petit sous-arbre local. Le critère important est ailleurs.`]}),`
`,(0,c.jsx)(t.h2,{id:`garde-fous`,children:`Garde-fous`}),`
`,(0,c.jsxs)(t.ul,{children:[`
`,(0,c.jsxs)(t.li,{children:[`Le code d'exploration doit être `,(0,c.jsx)(t.strong,{children:`visiblement identifiable`}),` comme tel.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Il doit vivre `,(0,c.jsx)(t.strong,{children:`au plus près de la story`}),` qui le porte.`]}),`
`,(0,c.jsxs)(t.li,{children:[`Il peut réutiliser des composants stabilisés de `,(0,c.jsx)(t.code,{children:`apps/web`}),`, mais il ne doit pas polluer le runtime applicatif avec des routes, layouts ou pages qui n'existent qu'à des fins de préfiguration.`]}),`
`,(0,c.jsx)(t.li,{children:`Si une exploration se stabilise, alors son code peut être promu vers une couche documentée du design system ou vers le code produit, avec le niveau de formalisation approprié (story stable, composant dédié, DDR si nécessaire).`}),`
`]}),`
`,(0,c.jsxs)(t.p,{children:[`Autrement dit : une exploration peut être libre dans sa composition, mais elle doit rester `,(0,c.jsx)(t.strong,{children:`localisée, lisible, et réversible`}),`.`]})]})}function s(e={}){let{wrapper:t}={...n(),...e.components};return t?(0,c.jsx)(t,{...e,children:(0,c.jsx)(o,{...e})}):o(e)}var c;e((()=>{c=t(),a(),r()}))();export{s as default};
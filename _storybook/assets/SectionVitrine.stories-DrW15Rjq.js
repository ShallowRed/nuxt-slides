import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{n,t as r}from"./section-vitrine-BsmwWfi1.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{i=t(),n(),a={title:`Explorations/Site vitrine T3 2026/Briques & sections/Briques/Section`,component:r,tags:[`autodocs`],parameters:{espace:`vitrine`,layout:`fullscreen`,docs:{description:{component:["Wrapper canonique d'une `<section>` vitrine.",``,`Quatre fonds canoniques (DDR-005) :`,"- `white` : fond page par défaut ;","- `alt-grey` : alternance neutre ;","- `alt-blue` : alternance identitaire (bleu pâle) ;","- `blue` : hero ou panneau CTA fort (texte blanc auto).",``,"Et un fond ponctuel `thematique` qui accepte une teinte pastel","libre via la prop `accent` (≤ 1 section thématique par page).",``,"Padding vertical canonique aligné `fr-py-6w fr-py-md-8w`,","container largeur lisible (`max-w-7xl` + gouttières responsive).",``,`Voir DDR-003, DDR-004, DDR-005, DDR-006, DDR-007.`].join(`
`)}}},argTypes:{fond:{control:`inline-radio`,options:[`white`,`alt-grey`,`alt-blue`,`blue`,`thematique`]},taille:{control:`inline-radio`,options:[`legere`,`defaut`,`large`]},accent:{control:`color`},sansContainer:{control:`boolean`}}},o=()=>(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(`h2`,{className:`text-2xl font-bold md:text-[2rem]`,children:`Titre de section`}),(0,i.jsx)(`p`,{className:`mt-4 max-w-2xl`,children:`Chapeau introductif placé sur deux ou trois lignes. La largeur lisible du container interne empêche les lignes de devenir trop longues, même sur grand écran.`})]}),s={name:`Fond blanc (défaut)`,args:{fond:`white`,children:(0,i.jsx)(o,{})}},c={name:`Fond alt-gris`,args:{fond:`alt-grey`,children:(0,i.jsx)(o,{})}},l={name:`Fond alt-bleu (alternance identitaire)`,args:{fond:`alt-blue`,children:(0,i.jsx)(o,{})}},u={name:`Fond bleu (hero ou CTA fort)`,args:{fond:`blue`,children:(0,i.jsx)(o,{})}},d={name:`Fond thématique (ponctuel, ≤ 1 par page)`,parameters:{docs:{description:{story:"Habillage thématique ponctuel d'une section. La teinte pastel est passée via `accent`. Exemple : `#fef4f2` pour la thématique « Jeunes » (Figma)."}}},args:{fond:`thematique`,accent:`#fef4f2`,children:(0,i.jsx)(o,{})}},f={name:`Rythme de page — alternance des fonds`,parameters:{docs:{description:{story:[`Démonstration du rythme vertical canonique d'une page vitrine :`,"`[blue, white, alt-grey, white, alt-blue, blue]`. L'alternance",`des fonds porte le découpage, sans marge custom entre sections.`].join(` `)}}},render:()=>(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)(r,{fond:`blue`,children:[(0,i.jsx)(`p`,{className:`text-sm font-medium tracking-wide uppercase opacity-80`,children:`Hero`}),(0,i.jsx)(`h1`,{className:`mt-2 text-4xl font-bold md:text-5xl`,children:`Première section, fond bleu`})]}),(0,i.jsx)(r,{fond:`white`,children:(0,i.jsx)(o,{})}),(0,i.jsx)(r,{fond:`alt-grey`,children:(0,i.jsx)(o,{})}),(0,i.jsx)(r,{fond:`white`,children:(0,i.jsx)(o,{})}),(0,i.jsx)(r,{fond:`alt-blue`,children:(0,i.jsx)(o,{})}),(0,i.jsx)(r,{fond:`blue`,children:(0,i.jsx)(`h2`,{className:`text-2xl font-bold md:text-[2rem]`,children:`Panneau CTA de fin de page`})})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: 'Fond blanc (défaut)',
  args: {
    fond: 'white',
    children: <ExempleContenu />
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Fond alt-gris',
  args: {
    fond: 'alt-grey',
    children: <ExempleContenu />
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Fond alt-bleu (alternance identitaire)',
  args: {
    fond: 'alt-blue',
    children: <ExempleContenu />
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Fond bleu (hero ou CTA fort)',
  args: {
    fond: 'blue',
    children: <ExempleContenu />
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Fond thématique (ponctuel, ≤ 1 par page)',
  parameters: {
    docs: {
      description: {
        story: "Habillage thématique ponctuel d'une section. La teinte pastel est passée via \`accent\`. Exemple : \`#fef4f2\` pour la thématique « Jeunes » (Figma)."
      }
    }
  },
  args: {
    fond: 'thematique',
    accent: '#fef4f2',
    children: <ExempleContenu />
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Rythme de page — alternance des fonds',
  parameters: {
    docs: {
      description: {
        story: ["Démonstration du rythme vertical canonique d'une page vitrine :", '\`[blue, white, alt-grey, white, alt-blue, blue]\`. L\\'alternance', 'des fonds porte le découpage, sans marge custom entre sections.'].join(' ')
      }
    }
  },
  render: () => <>
      <SectionVitrine fond="blue">
        <p className="text-sm font-medium tracking-wide uppercase opacity-80">
          Hero
        </p>
        <h1 className="mt-2 text-4xl font-bold md:text-5xl">
          Première section, fond bleu
        </h1>
      </SectionVitrine>
      <SectionVitrine fond="white">
        <ExempleContenu />
      </SectionVitrine>
      <SectionVitrine fond="alt-grey">
        <ExempleContenu />
      </SectionVitrine>
      <SectionVitrine fond="white">
        <ExempleContenu />
      </SectionVitrine>
      <SectionVitrine fond="alt-blue">
        <ExempleContenu />
      </SectionVitrine>
      <SectionVitrine fond="blue">
        <h2 className="text-2xl font-bold md:text-[2rem]">
          Panneau CTA de fin de page
        </h2>
      </SectionVitrine>
    </>
}`,...f.parameters?.docs?.source}}},p=[`FondBlanc`,`FondAltGris`,`FondAltBleu`,`FondBleu`,`FondThematique`,`Rythme`]}))();export{l as FondAltBleu,c as FondAltGris,s as FondBlanc,u as FondBleu,d as FondThematique,f as Rythme,p as __namedExportsOrder,a as default};
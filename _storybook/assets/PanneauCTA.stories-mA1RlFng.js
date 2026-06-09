import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{ct as n,i as r}from"./ri-wSxKWpyC.js";import{n as i,t as a}from"./button-BRDc0s48.js";import{n as o,t as s}from"./panneau-cta-CeT3yXUp.js";import{n as c,t as l}from"./section-vitrine-BsmwWfi1.js";var u,d,f,p,m;e((()=>{u=t(),n(),i(),o(),c(),d={title:`Explorations/Site vitrine T3 2026/Briques & sections/Compositions/Panneau CTA`,component:s,tags:[`autodocs`],parameters:{espace:`vitrine`,layout:`fullscreen`,docs:{description:{component:[`Carte bleue d'appel à l'action. Le composant rend uniquement la`,"carte : le fond clair de section (`alt-blue` typiquement) reste","porté par `SectionVitrine`.",``,"Le bouton est passé via le slot `action` (variante `contrast`",`recommandée sur ce fond bleu). Fond bleu statique : surface, pas`,`élément interactif.`].join(`
`)}}},argTypes:{niveauTitre:{control:`inline-radio`,options:[`h2`,`h3`]},centre:{control:`boolean`}}},f={name:`Aligné à gauche`,render:e=>(0,u.jsx)(l,{fond:`alt-blue`,children:(0,u.jsx)(s,{...e})}),args:{titre:`Rejoignez les entreprises engagées`,children:`Formalisez vos actions, suivez leur progression et inspirez d'autres entreprises de votre territoire.`,action:(0,u.jsxs)(a,{size:`lg`,variant:`contrast`,children:[`Composer mon programme`,(0,u.jsx)(r,{"aria-hidden":!0,className:`size-5`})]})}},p={name:`Centré`,render:e=>(0,u.jsx)(l,{fond:`alt-grey`,children:(0,u.jsx)(s,{...e})}),args:{centre:!0,titre:`Prêt à passer à l'action ?`,children:`La déclaration prend quelques minutes.`,action:(0,u.jsxs)(a,{size:`lg`,variant:`contrast`,children:[`Déclarer mon engagement`,(0,u.jsx)(r,{"aria-hidden":!0,className:`size-5`})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Aligné à gauche',
  render: args => <SectionVitrine fond="alt-blue">
      <PanneauCTA {...args} />
    </SectionVitrine>,
  args: {
    titre: 'Rejoignez les entreprises engagées',
    children: "Formalisez vos actions, suivez leur progression et inspirez d\\'autres entreprises de votre territoire.",
    action: <Button size="lg" variant="contrast">
        Composer mon programme
        <RiArrowRightLine aria-hidden className="size-5" />
      </Button>
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Centré',
  render: args => <SectionVitrine fond="alt-grey">
      <PanneauCTA {...args} />
    </SectionVitrine>,
  args: {
    centre: true,
    titre: 'Prêt à passer à l\\'action ?',
    children: 'La déclaration prend quelques minutes.',
    action: <Button size="lg" variant="contrast">
        Déclarer mon engagement
        <RiArrowRightLine aria-hidden className="size-5" />
      </Button>
  }
}`,...p.parameters?.docs?.source}}},m=[`Defaut`,`Centre`]}))();export{p as Centre,f as Defaut,m as __namedExportsOrder,d as default};
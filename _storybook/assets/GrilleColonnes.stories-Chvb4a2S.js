import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{n,t as r}from"./grille-colonnes-DPNKWmPN.js";import{n as i,t as a}from"./section-vitrine-BsmwWfi1.js";var o,s,c,l,u,d,f,p;e((()=>{o=t(),n(),i(),s={title:`Explorations/Site vitrine T3 2026/Briques & sections/Briques/Grille colonnes`,component:r,tags:[`autodocs`],parameters:{espace:`vitrine`,layout:`fullscreen`,docs:{description:{component:[`Grille N colonnes desktop / 1 colonne mobile, en CSS grid pur.`,``,"Remplace mécaniquement le couple `fr-grid-row` + `fr-col-md-*` dans",`les sections éditoriales (S2, S3, S4 de la doctrine pack 2).`,``,`Trois variantes de comptage : 2 (blocs denses), 3 (par défaut),`,`4 (étapes courtes). Trois gouttières : sm / md / lg.`].join(`
`)}}},argTypes:{colonnes:{control:`inline-radio`,options:[2,3,4]},gap:{control:`inline-radio`,options:[`sm`,`md`,`lg`]}}},c=({n:e})=>(0,o.jsxs)(`div`,{className:`rounded border border-dsfr-interactive-default-grey p-4`,children:[(0,o.jsxs)(`p`,{className:`text-sm font-medium opacity-70`,children:[`Bloc `,e]}),(0,o.jsx)(`p`,{className:`mt-2 text-base`,children:`Contenu de démonstration. La cellule s'étire à la hauteur de la rangée grâce au CSS grid sous-jacent.`})]}),l=e=>Array.from({length:e},(e,t)=>(0,o.jsx)(c,{n:t+1},t)),u={name:`2 colonnes`,render:e=>(0,o.jsx)(a,{fond:`white`,children:(0,o.jsx)(r,{...e,children:l(4)})}),args:{colonnes:2,gap:`md`}},d={name:`3 colonnes (par défaut)`,render:e=>(0,o.jsx)(a,{fond:`white`,children:(0,o.jsx)(r,{...e,children:l(3)})}),args:{colonnes:3,gap:`md`}},f={name:`4 colonnes (étapes courtes)`,render:e=>(0,o.jsx)(a,{fond:`alt-grey`,children:(0,o.jsx)(r,{...e,children:l(4)})}),args:{colonnes:4,gap:`md`}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: '2 colonnes',
  render: args => <SectionVitrine fond="white">
      <GrilleColonnes {...args}>{blocs(4)}</GrilleColonnes>
    </SectionVitrine>,
  args: {
    colonnes: 2,
    gap: 'md'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: '3 colonnes (par défaut)',
  render: args => <SectionVitrine fond="white">
      <GrilleColonnes {...args}>{blocs(3)}</GrilleColonnes>
    </SectionVitrine>,
  args: {
    colonnes: 3,
    gap: 'md'
  }
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: '4 colonnes (étapes courtes)',
  render: args => <SectionVitrine fond="alt-grey">
      <GrilleColonnes {...args}>{blocs(4)}</GrilleColonnes>
    </SectionVitrine>,
  args: {
    colonnes: 4,
    gap: 'md'
  }
}`,...f.parameters?.docs?.source}}},p=[`DeuxColonnes`,`TroisColonnes`,`QuatreColonnes`]}))();export{u as DeuxColonnes,f as QuatreColonnes,d as TroisColonnes,p as __namedExportsOrder,s as default};
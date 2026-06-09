import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{S as n,ct as r,i}from"./ri-wSxKWpyC.js";import{n as a,t as o}from"./button-BRDc0s48.js";var s,c,l,u,d,f,p,m,h,g;e((()=>{s=t(),r(),a(),c={title:`Design system/Briques/Partagé/Bouton`,component:o,tags:[`autodocs`],parameters:{docs:{description:{component:[`Bouton partagé entre la vitrine et l’espace membre moderne.`,"Variantes (quasiment alignées DSFR) : `default` (primaire), `outline`","(secondaire), `secondary` (tertiaire), `ghost`, `link`,","`destructive`, `contrast` (blanc sur fond bleu/sombre). Tailles :","`lg` / `default` / `sm` / `xs` + variantes `icon-*`.","Pour un lien, utiliser `asChild` autour d’une balise `<a>`."].join(`
`)}}},argTypes:{variant:{control:`inline-radio`,options:[`default`,`outline`,`secondary`,`ghost`,`link`,`destructive`,`contrast`]},size:{control:`inline-radio`,options:[`lg`,`default`,`sm`,`xs`]}}},l={args:{children:`Action principale`}},u={args:{variant:`outline`,children:`Action secondaire`}},d={name:`Toutes les variantes`,render:()=>(0,s.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,s.jsx)(o,{children:`Primaire`}),(0,s.jsx)(o,{variant:`outline`,children:`Secondaire`}),(0,s.jsx)(o,{variant:`secondary`,children:`Tertiaire`}),(0,s.jsx)(o,{variant:`ghost`,children:`Ghost`}),(0,s.jsx)(o,{variant:`link`,children:`Lien`})]})},f={name:`Tailles`,render:()=>(0,s.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,s.jsx)(o,{size:`lg`,children:`Large`}),(0,s.jsx)(o,{size:`default`,children:`Défaut`}),(0,s.jsx)(o,{size:`sm`,children:`Small`}),(0,s.jsx)(o,{size:`xs`,children:`XS`})]})},p={name:`Avec icône`,render:()=>(0,s.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3`,children:[(0,s.jsxs)(o,{children:[`Télécharger`,(0,s.jsx)(n,{})]}),(0,s.jsxs)(o,{variant:`outline`,children:[`Continuer`,(0,s.jsx)(i,{})]})]})},m={name:`En tant que lien`,render:()=>(0,s.jsx)(o,{asChild:!0,children:(0,s.jsx)(`a`,{href:`#`,children:`Aller à la page`})})},h={name:`Contrast (sur fond bleu)`,parameters:{docs:{description:{story:"Variante `contrast` : bouton blanc destiné aux surfaces bleues/sombres (hero, panneau CTA). Fonds opaques au survol (#fff → #f6f6f6 → #ededed), sans le voile bleuté d’un `bg-white/90`. Pendant logique du primaire en contexte contrasté."}}},render:()=>(0,s.jsxs)(`div`,{className:`flex flex-wrap items-center gap-3 rounded-xl bg-dsfr-background-action-high-blue-france p-8`,children:[(0,s.jsxs)(o,{variant:`contrast`,children:[`Créer un compte`,(0,s.jsx)(i,{})]}),(0,s.jsx)(o,{variant:`contrast`,size:`sm`,children:`Action`}),(0,s.jsx)(o,{variant:`outline`,className:`border-white bg-transparent text-white hover:bg-white/10`,children:`Secondaire inversé`})]})},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    children: 'Action principale'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    children: 'Action secondaire'
  }
}`,...u.parameters?.docs?.source}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  name: 'Toutes les variantes',
  render: () => <div className="flex flex-wrap items-center gap-3">
      <Button>Primaire</Button>
      <Button variant="outline">Secondaire</Button>
      <Button variant="secondary">Tertiaire</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Lien</Button>
    </div>
}`,...d.parameters?.docs?.source}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Tailles',
  render: () => <div className="flex flex-wrap items-center gap-3">
      <Button size="lg">Large</Button>
      <Button size="default">Défaut</Button>
      <Button size="sm">Small</Button>
      <Button size="xs">XS</Button>
    </div>
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Avec icône',
  render: () => <div className="flex flex-wrap items-center gap-3">
      <Button>
        Télécharger
        <RiDownloadLine />
      </Button>
      <Button variant="outline">
        Continuer
        <RiArrowRightLine />
      </Button>
    </div>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'En tant que lien',
  render: () => <Button asChild>
      <a href="#">Aller à la page</a>
    </Button>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Contrast (sur fond bleu)',
  parameters: {
    docs: {
      description: {
        story: 'Variante \`contrast\` : bouton blanc destiné aux surfaces bleues/sombres (hero, panneau CTA). Fonds opaques au survol (#fff → #f6f6f6 → #ededed), sans le voile bleuté d’un \`bg-white/90\`. Pendant logique du primaire en contexte contrasté.'
      }
    }
  },
  render: () => <div className="flex flex-wrap items-center gap-3 rounded-xl bg-dsfr-background-action-high-blue-france p-8">
      <Button variant="contrast">
        Créer un compte
        <RiArrowRightLine />
      </Button>
      <Button variant="contrast" size="sm">
        Action
      </Button>
      <Button variant="outline" className="border-white bg-transparent text-white hover:bg-white/10">
        Secondaire inversé
      </Button>
    </div>
}`,...h.parameters?.docs?.source}}},g=[`Primaire`,`Secondaire`,`Variantes`,`Tailles`,`AvecIcone`,`Lien`,`Contrast`]}))();export{p as AvecIcone,h as Contrast,m as Lien,l as Primaire,u as Secondaire,f as Tailles,d as Variantes,g as __namedExportsOrder,c as default};
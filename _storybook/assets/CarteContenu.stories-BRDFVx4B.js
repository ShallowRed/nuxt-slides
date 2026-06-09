import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{U as n,at as r,ct as i}from"./ri-wSxKWpyC.js";import{n as a,t as o}from"./carte-contenu-eDC2obO0.js";var s,c,l,u,d,f,p,m,h,g,_,v,y;e((()=>{s=t(),i(),a(),c={title:`Design system/Briques/Partagé/Carte de contenu`,component:o,tags:[`autodocs`],parameters:{docs:{description:{component:[`Carte de contenu versatile, partagée entre la vitrine et l’espace`,`membre moderne.`,``,"Axes de variation : `orientation` (verticale / horizontale),","`taille` (sm / md), `ratioImage`, `largeurImage`, et `lien`","(`complet` = pied CTA, `picto` = flèche dans le coin + carte","cliquable, `aucun`).",``,"Slots : `badge`, `surtitre`, `meta`, `image`, `description`."].join(`
`)}}},argTypes:{orientation:{control:`inline-radio`,options:[`verticale`,`horizontale`]},taille:{control:`inline-radio`,options:[`sm`,`md`]},ratioImage:{control:`inline-radio`,options:[`16/9`,`3/2`,`4/3`,`1/1`]},largeurImage:{control:`inline-radio`,options:[`tiers`,`moitie`]},lien:{control:`inline-radio`,options:[`complet`,`picto`,`aucun`]},niveauTitre:{control:`inline-radio`,options:[`h2`,`h3`,`h4`]}},decorators:[(e,t)=>{let{orientation:n,taille:r,titre:i}=t.args,a=`w-full`;return i&&(a=n===`horizontale`?`max-w-[480px]`:r===`md`?`max-w-[420px]`:`max-w-[320px]`),(0,s.jsx)(`div`,{className:`flex justify-center bg-dsfr-background-default-grey p-8 font-sans text-(--color-dsfr-text-default-grey)`,children:(0,s.jsx)(`div`,{className:`w-full ${a}`,children:(0,s.jsx)(e,{})})})}]},l=()=>(0,s.jsx)(`img`,{src:`https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=640&q=70`,alt:``}),u=({children:e})=>(0,s.jsx)(`span`,{className:`rounded bg-(--color-dsfr-background-alt-grey) px-1.5 py-0.5 text-xs font-bold uppercase text-(--color-dsfr-text-mention-grey)`,children:e}),d=()=>(0,s.jsxs)(s.Fragment,{children:[(0,s.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,s.jsx)(n,{className:`size-3`,"aria-hidden":!0}),`Paris`]}),(0,s.jsxs)(`span`,{className:`inline-flex items-center gap-1`,children:[(0,s.jsx)(r,{className:`size-3`,"aria-hidden":!0}),`2 h`]})]}),f={name:`Verticale — SM`,args:{titre:`Titre de la carte`,description:`Description optionnelle de la carte.`,href:`#`,badge:(0,s.jsx)(u,{children:`Rencontre`}),meta:(0,s.jsx)(d,{}),image:(0,s.jsx)(l,{}),orientation:`verticale`,taille:`sm`,lien:`complet`,lienLibelle:`Libellé`}},p={name:`Verticale — MD`,args:{titre:`Titre de la carte`,description:`Description optionnelle de la carte sur deux lignes environ.`,href:`#`,badge:(0,s.jsx)(u,{children:`Guide`}),meta:(0,s.jsx)(d,{}),image:(0,s.jsx)(l,{}),orientation:`verticale`,taille:`md`,lien:`complet`,lienLibelle:`Libellé`}},m={name:`Horizontale (MD)`,args:{titre:`Titre de la carte`,description:`Description optionnelle de la carte.`,href:`#`,surtitre:`12 juin 2026`,meta:(0,s.jsx)(d,{}),image:(0,s.jsx)(l,{}),orientation:`horizontale`,taille:`md`,largeurImage:`tiers`,lien:`complet`,lienLibelle:`Voir l’événement`}},h={name:`Lien picto (carte cliquable)`,parameters:{docs:{description:{story:`Le pied CTA est remplacé par une flèche dans le coin. La carte entière devient cliquable (lien agrandi sur le titre).`}}},args:{titre:`Actualité sans pied CTA`,description:`Toute la carte est cliquable, une flèche signale le lien.`,href:`#`,surtitre:`Actualité`,image:(0,s.jsx)(l,{}),orientation:`verticale`,taille:`sm`,lien:`picto`}},g={name:`Sans image`,args:{titre:`Ressource documentaire`,description:`Une carte sans zone visuelle, utile pour des listes denses.`,href:`#`,badge:(0,s.jsx)(u,{children:`Guide`}),meta:(0,s.jsx)(d,{}),orientation:`verticale`,taille:`sm`,lien:`complet`,lienLibelle:`Télécharger`}},_={name:`Ratio image 1/1`,args:{titre:`Image carrée`,description:`Variante de ratio d’image.`,href:`#`,image:(0,s.jsx)(l,{}),orientation:`verticale`,taille:`sm`,ratioImage:`1/1`,lien:`picto`}},v={name:`Galerie (grille de 3)`,parameters:{layout:`fullscreen`},render:()=>(0,s.jsxs)(`div`,{className:`mx-auto grid max-w-5xl grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3`,children:[(0,s.jsx)(o,{titre:`Premier contenu`,description:`Description courte.`,href:`#`,badge:(0,s.jsx)(u,{children:`Guide`}),image:(0,s.jsx)(l,{}),lien:`picto`}),(0,s.jsx)(o,{titre:`Deuxième contenu`,description:`Description courte.`,href:`#`,badge:(0,s.jsx)(u,{children:`Rencontre`}),image:(0,s.jsx)(l,{}),lien:`picto`}),(0,s.jsx)(o,{titre:`Troisième contenu`,description:`Description courte.`,href:`#`,badge:(0,s.jsx)(u,{children:`Actualité`}),image:(0,s.jsx)(l,{}),lien:`picto`})]})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Verticale — SM',
  args: {
    titre: 'Titre de la carte',
    description: 'Description optionnelle de la carte.',
    href: '#',
    badge: <Pastille>Rencontre</Pastille>,
    meta: <MetaExemple />,
    image: <ImageExemple />,
    orientation: 'verticale',
    taille: 'sm',
    lien: 'complet',
    lienLibelle: 'Libellé'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Verticale — MD',
  args: {
    titre: 'Titre de la carte',
    description: 'Description optionnelle de la carte sur deux lignes environ.',
    href: '#',
    badge: <Pastille>Guide</Pastille>,
    meta: <MetaExemple />,
    image: <ImageExemple />,
    orientation: 'verticale',
    taille: 'md',
    lien: 'complet',
    lienLibelle: 'Libellé'
  }
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Horizontale (MD)',
  args: {
    titre: 'Titre de la carte',
    description: 'Description optionnelle de la carte.',
    href: '#',
    surtitre: '12 juin 2026',
    meta: <MetaExemple />,
    image: <ImageExemple />,
    orientation: 'horizontale',
    taille: 'md',
    largeurImage: 'tiers',
    lien: 'complet',
    lienLibelle: 'Voir l’événement'
  }
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Lien picto (carte cliquable)',
  parameters: {
    docs: {
      description: {
        story: 'Le pied CTA est remplacé par une flèche dans le coin. La carte entière devient cliquable (lien agrandi sur le titre).'
      }
    }
  },
  args: {
    titre: 'Actualité sans pied CTA',
    description: 'Toute la carte est cliquable, une flèche signale le lien.',
    href: '#',
    surtitre: 'Actualité',
    image: <ImageExemple />,
    orientation: 'verticale',
    taille: 'sm',
    lien: 'picto'
  }
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Sans image',
  args: {
    titre: 'Ressource documentaire',
    description: 'Une carte sans zone visuelle, utile pour des listes denses.',
    href: '#',
    badge: <Pastille>Guide</Pastille>,
    meta: <MetaExemple />,
    orientation: 'verticale',
    taille: 'sm',
    lien: 'complet',
    lienLibelle: 'Télécharger'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'Ratio image 1/1',
  args: {
    titre: 'Image carrée',
    description: 'Variante de ratio d’image.',
    href: '#',
    image: <ImageExemple />,
    orientation: 'verticale',
    taille: 'sm',
    ratioImage: '1/1',
    lien: 'picto'
  }
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'Galerie (grille de 3)',
  parameters: {
    layout: 'fullscreen'
  },
  render: () => <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 p-8 sm:grid-cols-2 lg:grid-cols-3">
      <CarteContenu titre="Premier contenu" description="Description courte." href="#" badge={<Pastille>Guide</Pastille>} image={<ImageExemple />} lien="picto" />
      <CarteContenu titre="Deuxième contenu" description="Description courte." href="#" badge={<Pastille>Rencontre</Pastille>} image={<ImageExemple />} lien="picto" />
      <CarteContenu titre="Troisième contenu" description="Description courte." href="#" badge={<Pastille>Actualité</Pastille>} image={<ImageExemple />} lien="picto" />
    </div>
}`,...v.parameters?.docs?.source}}},y=[`VerticaleSm`,`VerticaleMd`,`Horizontale`,`LienPicto`,`SansImage`,`RatioCarre`,`Galerie`]}))();export{v as Galerie,m as Horizontale,h as LienPicto,_ as RatioCarre,g as SansImage,p as VerticaleMd,f as VerticaleSm,y as __namedExportsOrder,c as default};
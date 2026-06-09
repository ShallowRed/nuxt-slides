import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{n,t as r}from"./eyebrow-heading-BHc-S6Hv.js";import{n as i,t as a}from"./image-debordante-y4G-WRAz.js";import{n as o,t as s}from"./section-vitrine-BsmwWfi1.js";var c,l,u,d,f,p,m,h,g,_;e((()=>{c=t(),n(),i(),o(),l=`https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=900&q=70`,u=`https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=70`,d={title:`Explorations/Site vitrine T3 2026/Briques & sections/Briques/Image débordante`,component:a,tags:[`autodocs`],parameters:{espace:`vitrine`,layout:`fullscreen`,docs:{description:{component:[`Visuel illustratif à coins arrondis, ombre portée large`,"(`0 0 24px rgba(0,0,18,0.3)`, alias Figma `lee-shadow-lg`) et",`débordement vertical.`,``,"- `leger` / `fort` : débordement symétrique (`-my-4` / `-my-8`),",`  l'image sort en haut et en bas de sa rangée.`,"- `bas` : débordement vers le bas — l'image est calée en haut sur","  la rangée et plonge dans la section suivante (hero `/s-engager`)."].join(`
`)}}},argTypes:{debordement:{control:`inline-radio`,options:[`aucun`,`leger`,`fort`,`bas`]},src:{control:`text`},alt:{control:`text`}}},f={name:`Isolée (preview)`,render:e=>(0,c.jsx)(s,{fond:`white`,children:(0,c.jsx)(`div`,{className:`max-w-md`,children:(0,c.jsx)(a,{...e})})}),args:{src:l,alt:`Atelier collaboratif, en démonstration.`,debordement:`aucun`}},p={name:`Comparaison des débordements symétriques`,parameters:{docs:{description:{story:"Les trois intensités de débordement symétrique côte à côte. Le repère pointillé matérialise la rangée : `leger` et `fort` font dépasser l'image au-dessus et en dessous, `aucun` reste dans la rangée."}}},render:()=>(0,c.jsx)(s,{fond:`white`,children:(0,c.jsx)(`div`,{className:`grid grid-cols-1 gap-12 md:grid-cols-3`,children:[`aucun`,`leger`,`fort`].map(e=>(0,c.jsxs)(`div`,{className:`flex flex-col items-center gap-4`,children:[(0,c.jsx)(`div`,{className:`w-full border-y border-dashed border-(--color-dsfr-border-default-grey) py-6`,children:(0,c.jsx)(a,{src:l,alt:``,debordement:e,className:`aspect-3/2`})}),(0,c.jsxs)(`code`,{className:`text-sm text-(--color-dsfr-text-mention-grey)`,children:[`debordement="`,e,`"`]})]},e))})})},m={name:`Hero éditorial thématique (débordement symétrique)`,parameters:{docs:{description:{story:"Reproduction du hero éditorial thématique « Jeunes » : fond pastel rose (`#fef4f2`), eyebrow accentué `#ce614a`, image qui déborde fortement de la rangée à droite. Toutes les valeurs viennent de la maquette Figma node 2060:10039."}}},render:()=>(0,c.jsx)(s,{fond:`thematique`,accent:`#fef4f2`,children:(0,c.jsxs)(`div`,{className:`grid grid-cols-1 items-center gap-8 md:grid-cols-12`,children:[(0,c.jsxs)(`div`,{className:`md:col-span-8`,children:[(0,c.jsx)(r,{eyebrow:`Jeunes`,niveau:`h2`,className:`[&_p]:text-[#ce614a]`,children:`Proposez des actions de découverte des métiers aux collégiens`}),(0,c.jsx)(`p`,{className:`mt-4 max-w-2xl`,children:`Faites découvrir vos métiers aux collégiens en proposant des actions au sein de votre entreprise (visites, stages…) ou au sein du collège (interventions de vos collaborateurs en classe, participation à des forums des métiers, des salons…).`})]}),(0,c.jsx)(`div`,{className:`md:col-span-4`,children:(0,c.jsx)(a,{src:l,alt:`Deux collégiens découvrent un métier en atelier.`,debordement:`fort`,className:`aspect-square`})})]})})},h={name:`Hero débordant vers le bas (fond bleu → fond clair)`,parameters:{docs:{description:{story:"Pattern du hero `/s-engager` : l'image est calée en haut sur le titre (grille `items-start`) et plonge sous la section bleue (`overflow-visible`) dans le fond clair suivant. Sur `md+` elle est en `absolute` pour ne pas étirer le bloc bleu ; `empreinteClassName` règle la hauteur de rangée réservée."}}},render:()=>(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(s,{fond:`blue`,taille:`large`,className:`overflow-visible`,children:(0,c.jsxs)(`div`,{className:`grid grid-cols-1 items-start gap-8 md:grid-cols-12`,children:[(0,c.jsxs)(`div`,{className:`md:col-span-7`,children:[(0,c.jsx)(`h1`,{className:`text-4xl leading-tight font-bold md:text-5xl`,children:`Un visuel qui plonge dans la section suivante`}),(0,c.jsxs)(`p`,{className:`mt-6 max-w-xl text-xl leading-8 text-(--color-dsfr-text-inverted-blue-france)`,children:[`Le débordement `,(0,c.jsx)(`code`,{children:`bas`}),` donne du volume au hero sans gonfler le bloc bleu : seule la partie haute de l'image vit dans la section, le reste empiète sur le fond clair.`]})]}),(0,c.jsx)(`div`,{className:`relative z-10 md:col-span-5`,children:(0,c.jsx)(a,{src:u,alt:`Réunion d'une équipe en entreprise.`,debordement:`bas`,style:{objectPosition:`center 30%`},className:`border border-white/10 shadow-[0_0_48px_rgba(0,0,18,0.3)]`})})]})}),(0,c.jsx)(s,{fond:`alt-grey`,taille:`defaut`,children:(0,c.jsxs)(`p`,{className:`max-w-2xl text-(--color-dsfr-text-mention-grey)`,children:[`Section suivante (fond `,(0,c.jsx)(`code`,{children:`alt-grey`}),`) : le bas de l'image du hero déborde par-dessus ce fond, ce qui crée le volume caractéristique des maquettes.`]})})]})},g={name:`Duo éditorial (débordement léger en alternance)`,parameters:{docs:{description:{story:"Deux rangées texte / image alternées, débordement `leger` : l'image accroche le regard d'une rangée à l'autre sans casser la grille. Usage « pourquoi s'engager » / « comment ça marche »."}}},render:()=>(0,c.jsx)(s,{fond:`white`,children:(0,c.jsxs)(`div`,{className:`flex flex-col gap-16`,children:[(0,c.jsxs)(`div`,{className:`grid grid-cols-1 items-center gap-8 md:grid-cols-2`,children:[(0,c.jsx)(a,{src:l,alt:`Atelier collaboratif en entreprise.`,debordement:`leger`,className:`aspect-3/2`}),(0,c.jsxs)(`div`,{children:[(0,c.jsx)(r,{eyebrow:`Étape 1`,niveau:`h3`,children:`Choisissez vos thématiques`}),(0,c.jsx)(`p`,{className:`mt-3 text-(--color-dsfr-text-mention-grey)`,children:`Sélectionnez les axes qui font sens pour votre activité. Le référentiel s'adapte à votre maturité, pas l'inverse.`})]})]}),(0,c.jsxs)(`div`,{className:`grid grid-cols-1 items-center gap-8 md:grid-cols-2`,children:[(0,c.jsx)(`div`,{className:`md:order-2`,children:(0,c.jsx)(a,{src:u,alt:`Échanges entre dirigeants d'entreprise.`,debordement:`leger`,className:`aspect-3/2`})}),(0,c.jsxs)(`div`,{className:`md:order-1`,children:[(0,c.jsx)(r,{eyebrow:`Étape 2`,niveau:`h3`,children:`Passez à l'action avec vos pairs`}),(0,c.jsx)(`p`,{className:`mt-3 text-(--color-dsfr-text-mention-grey)`,children:`Déclarez vos initiatives, suivez leur progression et inspirez d'autres entreprises de votre territoire.`})]})]})]})})},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Isolée (preview)',
  render: args => <SectionVitrine fond="white">
      <div className="max-w-md">
        <ImageDebordante {...args} />
      </div>
    </SectionVitrine>,
  args: {
    src: SAMPLE_IMG,
    alt: 'Atelier collaboratif, en démonstration.',
    debordement: 'aucun'
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Comparaison des débordements symétriques',
  parameters: {
    docs: {
      description: {
        story: "Les trois intensités de débordement symétrique côte à côte. Le repère pointillé matérialise la rangée : \`leger\` et \`fort\` font dépasser l'image au-dessus et en dessous, \`aucun\` reste dans la rangée."
      }
    }
  },
  render: () => <SectionVitrine fond="white">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {(['aucun', 'leger', 'fort'] as const).map(d => <div key={d} className="flex flex-col items-center gap-4">
            <div className="w-full border-y border-dashed border-(--color-dsfr-border-default-grey) py-6">
              <ImageDebordante src={SAMPLE_IMG} alt="" debordement={d} className="aspect-3/2" />
            </div>
            <code className="text-sm text-(--color-dsfr-text-mention-grey)">
              debordement=&quot;{d}&quot;
            </code>
          </div>)}
      </div>
    </SectionVitrine>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Hero éditorial thématique (débordement symétrique)',
  parameters: {
    docs: {
      description: {
        story: 'Reproduction du hero éditorial thématique « Jeunes » : fond pastel rose (\`#fef4f2\`), eyebrow accentué \`#ce614a\`, image qui déborde fortement de la rangée à droite. Toutes les valeurs viennent de la maquette Figma node 2060:10039.'
      }
    }
  },
  render: () => <SectionVitrine fond="thematique" accent="#fef4f2">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-12">
        <div className="md:col-span-8">
          <EyebrowHeading eyebrow="Jeunes" niveau="h2" className="[&_p]:text-[#ce614a]">
            Proposez des actions de découverte des métiers aux collégiens
          </EyebrowHeading>
          <p className="mt-4 max-w-2xl">
            Faites découvrir vos métiers aux collégiens en proposant des actions
            au sein de votre entreprise (visites, stages…) ou au sein du collège
            (interventions de vos collaborateurs en classe, participation à des
            forums des métiers, des salons…).
          </p>
        </div>
        <div className="md:col-span-4">
          <ImageDebordante src={SAMPLE_IMG} alt="Deux collégiens découvrent un métier en atelier." debordement="fort" className="aspect-square" />
        </div>
      </div>
    </SectionVitrine>
}`,...m.parameters?.docs?.source}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  name: 'Hero débordant vers le bas (fond bleu → fond clair)',
  parameters: {
    docs: {
      description: {
        story: "Pattern du hero \`/s-engager\` : l'image est calée en haut sur le titre (grille \`items-start\`) et plonge sous la section bleue (\`overflow-visible\`) dans le fond clair suivant. Sur \`md+\` elle est en \`absolute\` pour ne pas étirer le bloc bleu ; \`empreinteClassName\` règle la hauteur de rangée réservée."
      }
    }
  },
  render: () => <>
      <SectionVitrine fond="blue" taille="large" className="overflow-visible">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h1 className="text-4xl leading-tight font-bold md:text-5xl">
              Un visuel qui plonge dans la section suivante
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-8 text-(--color-dsfr-text-inverted-blue-france)">
              Le débordement <code>bas</code> donne du volume au hero sans
              gonfler le bloc bleu : seule la partie haute de l'image vit dans
              la section, le reste empiète sur le fond clair.
            </p>
          </div>
          <div className="relative z-10 md:col-span-5">
            <ImageDebordante src={SAMPLE_IMG_2} alt="Réunion d'une équipe en entreprise." debordement="bas" style={{
            objectPosition: 'center 30%'
          }} className="border border-white/10 shadow-[0_0_48px_rgba(0,0,18,0.3)]" />
          </div>
        </div>
      </SectionVitrine>
      <SectionVitrine fond="alt-grey" taille="defaut">
        <p className="max-w-2xl text-(--color-dsfr-text-mention-grey)">
          Section suivante (fond <code>alt-grey</code>) : le bas de l'image du
          hero déborde par-dessus ce fond, ce qui crée le volume caractéristique
          des maquettes.
        </p>
      </SectionVitrine>
    </>
}`,...h.parameters?.docs?.source}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Duo éditorial (débordement léger en alternance)',
  parameters: {
    docs: {
      description: {
        story: "Deux rangées texte / image alternées, débordement \`leger\` : l'image accroche le regard d'une rangée à l'autre sans casser la grille. Usage « pourquoi s'engager » / « comment ça marche »."
      }
    }
  },
  render: () => <SectionVitrine fond="white">
      <div className="flex flex-col gap-16">
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <ImageDebordante src={SAMPLE_IMG} alt="Atelier collaboratif en entreprise." debordement="leger" className="aspect-3/2" />
          <div>
            <EyebrowHeading eyebrow="Étape 1" niveau="h3">
              Choisissez vos thématiques
            </EyebrowHeading>
            <p className="mt-3 text-(--color-dsfr-text-mention-grey)">
              Sélectionnez les axes qui font sens pour votre activité. Le
              référentiel s'adapte à votre maturité, pas l'inverse.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
          <div className="md:order-2">
            <ImageDebordante src={SAMPLE_IMG_2} alt="Échanges entre dirigeants d'entreprise." debordement="leger" className="aspect-3/2" />
          </div>
          <div className="md:order-1">
            <EyebrowHeading eyebrow="Étape 2" niveau="h3">
              Passez à l'action avec vos pairs
            </EyebrowHeading>
            <p className="mt-3 text-(--color-dsfr-text-mention-grey)">
              Déclarez vos initiatives, suivez leur progression et inspirez
              d'autres entreprises de votre territoire.
            </p>
          </div>
        </div>
      </div>
    </SectionVitrine>
}`,...g.parameters?.docs?.source}}},_=[`Isolee`,`Variantes`,`HeroThematique`,`DebordementBas`,`DuoEditorial`]}))();export{h as DebordementBas,g as DuoEditorial,m as HeroThematique,f as Isolee,p as Variantes,_ as __namedExportsOrder,d as default};
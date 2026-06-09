import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{L as n,ct as r,it as i,y as a}from"./ri-wSxKWpyC.js";import{n as o,t as s}from"./bloc-pedagogique-9VNYcbI1.js";import{n as c,t as l}from"./eyebrow-heading-BHc-S6Hv.js";import{n as u,t as d}from"./grille-colonnes-DPNKWmPN.js";import{n as f,t as p}from"./section-vitrine-BsmwWfi1.js";var m,h,g,_,v,y,b;e((()=>{m=t(),r(),o(),c(),u(),f(),h={title:`Explorations/Site vitrine T3 2026/Briques & sections/Briques/Bloc pédagogique`,component:s,tags:[`autodocs`],parameters:{espace:`vitrine`,layout:`fullscreen`,docs:{description:{component:[`Carte sans image ni CTA : picto optionnel, titre court, texte explicatif.`,``,"Deux présentations : `nu` (posé sur le fond de section) et `carte`","(encart bordé sur fond blanc). Une variante `numero` remplace le",`picto par une pastille bleue numérotée, pour composer une séquence`,`d'étapes. Hérite la couleur de texte de la section parente.`].join(`
`)}}},argTypes:{niveauTitre:{control:`inline-radio`,options:[`h2`,`h3`,`h4`]},variante:{control:`inline-radio`,options:[`nu`,`carte`]},numero:{control:`number`}}},g={name:`Bloc unitaire (nu)`,render:e=>(0,m.jsx)(p,{fond:`white`,children:(0,m.jsx)(`div`,{className:`max-w-sm`,children:(0,m.jsx)(s,{...e})})}),args:{icone:(0,m.jsx)(a,{className:`size-6`}),titre:`Un cadre lisible`,children:`Quatre axes stratégiques structurent la démarche. On voit le référentiel complet d'un coup d'œil.`,variante:`nu`}},_={name:`En grille 3 colonnes (S2)`,render:()=>(0,m.jsxs)(p,{fond:`white`,children:[(0,m.jsx)(l,{eyebrow:`Comment lire le référentiel`,niveau:`h2`,children:`Trois niveaux pour passer à l'action`}),(0,m.jsxs)(d,{colonnes:3,gap:`lg`,className:`mt-10`,children:[(0,m.jsx)(s,{icone:(0,m.jsx)(a,{className:`size-6`}),titre:`Axe`,children:`Une grande orientation stratégique. Quatre à cinq axes couvrent l'ensemble du référentiel.`}),(0,m.jsx)(s,{icone:(0,m.jsx)(i,{className:`size-6`}),titre:`Thématique`,children:`Un sujet concret rattaché à un axe. Une dizaine de thématiques par axe en moyenne.`}),(0,m.jsx)(s,{icone:(0,m.jsx)(n,{className:`size-6`}),titre:`Initiative`,children:`Une action mesurable et déclarable. C'est le niveau où l'entreprise s'engage.`})]})]})},v={name:`En grille, variante carte (bénéfices)`,render:()=>(0,m.jsxs)(p,{fond:`alt-blue`,children:[(0,m.jsx)(l,{eyebrow:`Pourquoi s'engager`,niveau:`h2`,children:`Trois bénéfices concrets`}),(0,m.jsxs)(d,{colonnes:3,gap:`lg`,className:`mt-10`,children:[(0,m.jsx)(s,{variante:`carte`,icone:(0,m.jsx)(i,{className:`size-6`}),titre:`Une communauté active`,children:`Rejoignez un réseau d'entreprises engagées et partagez vos pratiques.`}),(0,m.jsx)(s,{variante:`carte`,icone:(0,m.jsx)(a,{className:`size-6`}),titre:`Un cap structuré`,children:`Le référentiel donne un cadre clair pour orienter votre démarche.`}),(0,m.jsx)(s,{variante:`carte`,icone:(0,m.jsx)(n,{className:`size-6`}),titre:`Des actions mesurables`,children:`Déclarez vos initiatives et suivez leur progression dans le temps.`})]})]})},y={name:`En séquence d'étapes (numero)`,render:()=>(0,m.jsxs)(p,{fond:`white`,children:[(0,m.jsx)(l,{eyebrow:`Passer à l'action`,niveau:`h2`,children:`S'engager en quatre étapes`}),(0,m.jsxs)(d,{colonnes:4,gap:`lg`,className:`mt-10`,children:[(0,m.jsx)(s,{numero:1,titre:`Évaluer le point de départ`,children:`Faites le point sur vos pratiques actuelles et vos marges de progression.`}),(0,m.jsx)(s,{numero:2,titre:`Définir un objectif`,children:`Choisissez une cible chiffrée et réaliste, alignée sur votre activité.`}),(0,m.jsx)(s,{numero:3,titre:`Déclarer l'engagement`,children:`Formalisez l'initiative dans votre espace membre pour la rendre visible.`}),(0,m.jsx)(s,{numero:4,titre:`Suivre les résultats`,children:`Mesurez vos progrès et inspirez d'autres entreprises de votre réseau.`})]})]})},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  name: 'Bloc unitaire (nu)',
  render: args => <SectionVitrine fond="white">
      <div className="max-w-sm">
        <BlocPedagogique {...args} />
      </div>
    </SectionVitrine>,
  args: {
    icone: <RiCompass3Line className="size-6" />,
    titre: 'Un cadre lisible',
    children: "Quatre axes stratégiques structurent la démarche. On voit le référentiel complet d'un coup d'œil.",
    variante: 'nu'
  }
}`,...g.parameters?.docs?.source}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  name: 'En grille 3 colonnes (S2)',
  render: () => <SectionVitrine fond="white">
      <EyebrowHeading eyebrow="Comment lire le référentiel" niveau="h2">
        Trois niveaux pour passer à l'action
      </EyebrowHeading>
      <GrilleColonnes colonnes={3} gap="lg" className="mt-10">
        <BlocPedagogique icone={<RiCompass3Line className="size-6" />} titre="Axe">
          Une grande orientation stratégique. Quatre à cinq axes couvrent
          l'ensemble du référentiel.
        </BlocPedagogique>
        <BlocPedagogique icone={<RiTeamLine className="size-6" />} titre="Thématique">
          Un sujet concret rattaché à un axe. Une dizaine de thématiques par axe
          en moyenne.
        </BlocPedagogique>
        <BlocPedagogique icone={<RiLineChartLine className="size-6" />} titre="Initiative">
          Une action mesurable et déclarable. C'est le niveau où l'entreprise
          s'engage.
        </BlocPedagogique>
      </GrilleColonnes>
    </SectionVitrine>
}`,..._.parameters?.docs?.source}}},v.parameters={...v.parameters,docs:{...v.parameters?.docs,source:{originalSource:`{
  name: 'En grille, variante carte (bénéfices)',
  render: () => <SectionVitrine fond="alt-blue">
      <EyebrowHeading eyebrow="Pourquoi s'engager" niveau="h2">
        Trois bénéfices concrets
      </EyebrowHeading>
      <GrilleColonnes colonnes={3} gap="lg" className="mt-10">
        <BlocPedagogique variante="carte" icone={<RiTeamLine className="size-6" />} titre="Une communauté active">
          Rejoignez un réseau d'entreprises engagées et partagez vos pratiques.
        </BlocPedagogique>
        <BlocPedagogique variante="carte" icone={<RiCompass3Line className="size-6" />} titre="Un cap structuré">
          Le référentiel donne un cadre clair pour orienter votre démarche.
        </BlocPedagogique>
        <BlocPedagogique variante="carte" icone={<RiLineChartLine className="size-6" />} titre="Des actions mesurables">
          Déclarez vos initiatives et suivez leur progression dans le temps.
        </BlocPedagogique>
      </GrilleColonnes>
    </SectionVitrine>
}`,...v.parameters?.docs?.source}}},y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  name: "En séquence d'étapes (numero)",
  render: () => <SectionVitrine fond="white">
      <EyebrowHeading eyebrow="Passer à l'action" niveau="h2">
        S'engager en quatre étapes
      </EyebrowHeading>
      <GrilleColonnes colonnes={4} gap="lg" className="mt-10">
        <BlocPedagogique numero={1} titre="Évaluer le point de départ">
          Faites le point sur vos pratiques actuelles et vos marges de
          progression.
        </BlocPedagogique>
        <BlocPedagogique numero={2} titre="Définir un objectif">
          Choisissez une cible chiffrée et réaliste, alignée sur votre activité.
        </BlocPedagogique>
        <BlocPedagogique numero={3} titre="Déclarer l'engagement">
          Formalisez l'initiative dans votre espace membre pour la rendre
          visible.
        </BlocPedagogique>
        <BlocPedagogique numero={4} titre="Suivre les résultats">
          Mesurez vos progrès et inspirez d'autres entreprises de votre réseau.
        </BlocPedagogique>
      </GrilleColonnes>
    </SectionVitrine>
}`,...y.parameters?.docs?.source}}},b=[`Unitaire`,`GrilleTroisColonnes`,`GrilleCartes`,`EtapesNumerotees`]}))();export{y as EtapesNumerotees,v as GrilleCartes,_ as GrilleTroisColonnes,g as Unitaire,b as __namedExportsOrder,h as default};
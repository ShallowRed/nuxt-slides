import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{C as n,ct as r,f as i,m as a,r as o,t as s}from"./ri-wSxKWpyC.js";import{n as c,t as l}from"./button-BRDc0s48.js";import{a as u,i as d,n as f,r as p,t as m}from"./tabs-B3m8aHmg.js";import{n as h,t as g}from"./page-header-DQCEk-I8.js";import{n as _,t as v}from"./calendar-4c_A3Rp3.js";var y,b,x,S,C,w,T,E;e((()=>{y=t(),r(),h(),_(),c(),u(),b={title:`Design system/Briques/Webapp/PageHeader`,component:g,tags:[`autodocs`],parameters:{espace:`espace-membre`,layout:`fullscreen`,docs:{description:{component:[`En-tête contextuel sticky des pages de l'espace membre moderne.`,``,"Replace exactement le bloc `contextual-header` de la maquette Figma :",`sticky top, bordure inférieure grise, icône Magicoon 24px alignée avec`,`le titre 30px, slots pré-titre/actions/onglets.`].join(`
`)}}},decorators:[e=>(0,y.jsx)(`div`,{className:`@container/main h-full min-h-full bg-dsfr-background-alt-grey`,children:(0,y.jsx)(`div`,{className:`mx-auto flex w-full max-w-7xl flex-col items-start`,children:(0,y.jsx)(e,{})})})]},x={name:`Titre seul`,args:{title:`Mes participations`}},S={name:`Titre + icône`,args:{icon:v,title:`Mes participations`}},C={name:`Titre + icône + actions`,args:{icon:v,title:`Mes participations`,actions:(0,y.jsxs)(l,{type:`button`,size:`sm`,children:[(0,y.jsx)(s,{"aria-hidden":!0,className:`size-4`}),`Proposer un événement`]})}},w={name:`Avec pré-titre (retour)`,args:{icon:v,title:`Forum de l'inclusion économique`,preTitle:(0,y.jsxs)(l,{type:`button`,variant:`ghost`,size:`sm`,className:`-ml-2`,children:[(0,y.jsx)(o,{"aria-hidden":!0,className:`size-4`}),`Retour`]})}},T={name:`Avec onglets`,render:()=>(0,y.jsxs)(m,{defaultValue:`a-venir`,className:`contents`,children:[(0,y.jsx)(g,{icon:v,title:`Mes participations`,tabs:(0,y.jsxs)(p,{variant:`line`,children:[(0,y.jsxs)(d,{value:`a-venir`,children:[(0,y.jsx)(a,{}),`À venir`]}),(0,y.jsxs)(d,{value:`passes`,children:[(0,y.jsx)(i,{}),`Passés`]}),(0,y.jsxs)(d,{value:`brouillons`,children:[(0,y.jsx)(n,{}),`Brouillons`]})]})}),(0,y.jsx)(f,{value:`a-venir`}),(0,y.jsx)(f,{value:`passes`}),(0,y.jsx)(f,{value:`brouillons`})]})},x.parameters={...x.parameters,docs:{...x.parameters?.docs,source:{originalSource:`{
  name: 'Titre seul',
  args: {
    title: 'Mes participations'
  }
}`,...x.parameters?.docs?.source}}},S.parameters={...S.parameters,docs:{...S.parameters?.docs,source:{originalSource:`{
  name: 'Titre + icône',
  args: {
    icon: CalendarIcon,
    title: 'Mes participations'
  }
}`,...S.parameters?.docs?.source}}},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  name: 'Titre + icône + actions',
  args: {
    icon: CalendarIcon,
    title: 'Mes participations',
    actions: <Button type="button" size="sm">
        <RiAddLine aria-hidden className="size-4" />
        Proposer un événement
      </Button>
  }
}`,...C.parameters?.docs?.source}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  name: 'Avec pré-titre (retour)',
  args: {
    icon: CalendarIcon,
    title: "Forum de l'inclusion économique",
    preTitle: <Button type="button" variant="ghost" size="sm" className="-ml-2">
        <RiArrowLeftLine aria-hidden className="size-4" />
        Retour
      </Button>
  }
}`,...w.parameters?.docs?.source}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  name: 'Avec onglets',
  render: () => <Tabs defaultValue="a-venir" className="contents">
      <PageHeader icon={CalendarIcon} title="Mes participations" tabs={<TabsList variant="line">
            <TabsTrigger value="a-venir">
              <RiCalendarLine />À venir
            </TabsTrigger>
            <TabsTrigger value="passes">
              <RiCalendarCheckLine />
              Passés
            </TabsTrigger>
            <TabsTrigger value="brouillons">
              <RiDraftLine />
              Brouillons
            </TabsTrigger>
          </TabsList>} />
      <TabsContent value="a-venir" />
      <TabsContent value="passes" />
      <TabsContent value="brouillons" />
    </Tabs>
}`,...T.parameters?.docs?.source}}},E=[`TitreSeul`,`AvecIcone`,`AvecActions`,`AvecPreTitre`,`AvecOnglets`]}))();export{C as AvecActions,S as AvecIcone,T as AvecOnglets,w as AvecPreTitre,x as TitreSeul,E as __namedExportsOrder,b as default};
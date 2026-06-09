import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{ct as n,j as r,u as i,w as a}from"./ri-wSxKWpyC.js";import{a as o,i as s,n as c,r as l,t as u}from"./tabs-B3m8aHmg.js";var d,f,p,m,h;e((()=>{d=t(),n(),o(),f={title:`Design system/Briques/Webapp/Onglets`,component:l,tags:[`autodocs`],parameters:{espace:`espace-membre`,layout:`centered`,docs:{description:{component:['Onglets DSFR de l\'espace membre moderne (`TabsList variant="line"`).',`L'onglet actif est souligné en bleu france ; au survol, fond gris`,"alterné. À ne pas confondre avec la variante `default` (pilule)."].join(`
`)}}},decorators:[e=>(0,d.jsx)(`div`,{className:`w-full max-w-2xl bg-white p-6`,children:(0,d.jsx)(e,{})})]},p={name:`Variante « line » (DSFR)`,render:()=>(0,d.jsxs)(u,{defaultValue:`informations`,children:[(0,d.jsxs)(l,{variant:`line`,children:[(0,d.jsxs)(s,{value:`informations`,children:[(0,d.jsx)(i,{}),`Informations`]}),(0,d.jsxs)(s,{value:`membres`,children:[(0,d.jsx)(r,{}),`Membres`]}),(0,d.jsxs)(s,{value:`fiche-publique`,children:[(0,d.jsx)(a,{}),`Fiche publique`]})]}),(0,d.jsx)(c,{value:`informations`,className:`pt-4 text-sm`,children:`Contenu de l’onglet « Informations ».`}),(0,d.jsx)(c,{value:`membres`,className:`pt-4 text-sm`,children:`Contenu de l’onglet « Membres ».`}),(0,d.jsx)(c,{value:`fiche-publique`,className:`pt-4 text-sm`,children:`Contenu de l’onglet « Fiche publique ».`})]})},m={name:`Sans icône`,render:()=>(0,d.jsxs)(u,{defaultValue:`a-venir`,children:[(0,d.jsxs)(l,{variant:`line`,children:[(0,d.jsx)(s,{value:`a-venir`,children:`À venir`}),(0,d.jsx)(s,{value:`passes`,children:`Passés`}),(0,d.jsx)(s,{value:`brouillons`,children:`Brouillons`})]}),(0,d.jsx)(c,{value:`a-venir`,className:`pt-4 text-sm`,children:`Vos prochains événements.`}),(0,d.jsx)(c,{value:`passes`,className:`pt-4 text-sm`,children:`Historique de vos participations.`}),(0,d.jsx)(c,{value:`brouillons`,className:`pt-4 text-sm`,children:`Événements non publiés.`})]})},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Variante « line » (DSFR)',
  render: () => <Tabs defaultValue="informations">
      <TabsList variant="line">
        <TabsTrigger value="informations">
          <RiBuildingLine />
          Informations
        </TabsTrigger>
        <TabsTrigger value="membres">
          <RiGroupLine />
          Membres
        </TabsTrigger>
        <TabsTrigger value="fiche-publique">
          <RiEarthLine />
          Fiche publique
        </TabsTrigger>
      </TabsList>
      <TabsContent value="informations" className="pt-4 text-sm">
        Contenu de l’onglet « Informations ».
      </TabsContent>
      <TabsContent value="membres" className="pt-4 text-sm">
        Contenu de l’onglet « Membres ».
      </TabsContent>
      <TabsContent value="fiche-publique" className="pt-4 text-sm">
        Contenu de l’onglet « Fiche publique ».
      </TabsContent>
    </Tabs>
}`,...p.parameters?.docs?.source}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  name: 'Sans icône',
  render: () => <Tabs defaultValue="a-venir">
      <TabsList variant="line">
        <TabsTrigger value="a-venir">À venir</TabsTrigger>
        <TabsTrigger value="passes">Passés</TabsTrigger>
        <TabsTrigger value="brouillons">Brouillons</TabsTrigger>
      </TabsList>
      <TabsContent value="a-venir" className="pt-4 text-sm">
        Vos prochains événements.
      </TabsContent>
      <TabsContent value="passes" className="pt-4 text-sm">
        Historique de vos participations.
      </TabsContent>
      <TabsContent value="brouillons" className="pt-4 text-sm">
        Événements non publiés.
      </TabsContent>
    </Tabs>
}`,...m.parameters?.docs?.source}}},h=[`Ligne`,`SansIcone`]}))();export{p as Ligne,m as SansIcone,h as __namedExportsOrder,f as default};
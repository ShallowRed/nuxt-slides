import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{n,t as r}from"./page-content-DIpyyD-6.js";import{a as i,i as a,n as o,o as s,t as c}from"./card-BhUrOmF8.js";function l({span:e,label:t}){return(0,u.jsxs)(c,{className:e,children:[(0,u.jsx)(a,{children:(0,u.jsx)(i,{className:`text-base`,children:t})}),(0,u.jsx)(o,{className:`text-muted-foreground text-sm`,children:`Contenu fictif.`})]})}var u,d,f,p,m;e((()=>{u=t(),n(),s(),d={title:`Design system/Briques/Webapp/PageContent`,component:r,tags:[`autodocs`],parameters:{espace:`espace-membre`,layout:`fullscreen`,docs:{description:{component:[`Slot principal des pages de l'espace membre.`,"Les enfants utilisent `col-span-*` (1 à 12) pour se positionner."].join(`
`)}}},decorators:[e=>(0,u.jsx)(`div`,{className:`@container/main min-h-96 bg-dsfr-background-alt-grey`,children:(0,u.jsx)(`div`,{className:`mx-auto flex w-full max-w-7xl flex-col items-start`,children:(0,u.jsx)(e,{})})})]},f={name:`Grille 12 colonnes (par défaut)`,args:{children:(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(l,{span:`col-span-12`,label:`col-span-12`}),(0,u.jsx)(l,{span:`col-span-6`,label:`col-span-6`}),(0,u.jsx)(l,{span:`col-span-6`,label:`col-span-6`}),(0,u.jsx)(l,{span:`col-span-4`,label:`col-span-4`}),(0,u.jsx)(l,{span:`col-span-4`,label:`col-span-4`}),(0,u.jsx)(l,{span:`col-span-4`,label:`col-span-4`})]})}},p={name:`Sans grille (grid=false)`,args:{grid:!1,children:(0,u.jsxs)(`div`,{className:`prose max-w-3xl`,children:[(0,u.jsx)(`h2`,{children:`Bloc plein largeur`}),(0,u.jsxs)(`p`,{children:["Avec `grid=",`{false}`,"`, `PageContent` ne pose plus que le padding. Utile pour un article, un formulaire long ou tout contenu qui gère sa propre largeur."]})]})}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  name: 'Grille 12 colonnes (par défaut)',
  args: {
    children: <>
        <Bloc span="col-span-12" label="col-span-12" />
        <Bloc span="col-span-6" label="col-span-6" />
        <Bloc span="col-span-6" label="col-span-6" />
        <Bloc span="col-span-4" label="col-span-4" />
        <Bloc span="col-span-4" label="col-span-4" />
        <Bloc span="col-span-4" label="col-span-4" />
      </>
  }
}`,...f.parameters?.docs?.source}}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  name: 'Sans grille (grid=false)',
  args: {
    grid: false,
    children: <div className="prose max-w-3xl">
        <h2>Bloc plein largeur</h2>
        <p>
          Avec \`grid={'{false}'}\`, \`PageContent\` ne pose plus que le padding.
          Utile pour un article, un formulaire long ou tout contenu qui gère sa
          propre largeur.
        </p>
      </div>
  }
}`,...p.parameters?.docs?.source}}},m=[`GrilleParDefaut`,`SansGrille`]}))();export{f as GrilleParDefaut,p as SansGrille,m as __namedExportsOrder,d as default};
import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{n,t as r}from"./sidebar-badge-9mK50ZF0.js";var i,a,o,s,c,l,u,d;e((()=>{i=t(),n(),a={title:`Design system/Briques/Webapp/SidebarBadge`,component:r,tags:[`autodocs`],parameters:{espace:`espace-membre`,docs:{description:{component:"Badge de statut des items de sidebar dans `AppSidebar`."}}},argTypes:{badge:{control:`inline-radio`,options:[`done`,`new`,`info`,`disabled`]}}},o={args:{badge:`done`}},s={args:{badge:`new`}},c={args:{badge:`info`}},l={args:{badge:`disabled`}},u={name:`Toutes les variantes`,render:()=>(0,i.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,i.jsxs)(`span`,{className:`flex items-center gap-2 text-sm`,children:[(0,i.jsx)(r,{badge:`done`}),`done`]}),(0,i.jsxs)(`span`,{className:`flex items-center gap-2 text-sm`,children:[(0,i.jsx)(r,{badge:`new`}),`new`]}),(0,i.jsxs)(`span`,{className:`flex items-center gap-2 text-sm`,children:[(0,i.jsx)(r,{badge:`info`}),`info`]}),(0,i.jsxs)(`span`,{className:`flex items-center gap-2 text-sm`,children:[(0,i.jsx)(r,{badge:`disabled`}),`disabled`]})]})},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    badge: 'done'
  }
}`,...o.parameters?.docs?.source}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    badge: 'new'
  }
}`,...s.parameters?.docs?.source}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    badge: 'info'
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    badge: 'disabled'
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Toutes les variantes',
  render: () => <div className="flex items-center gap-4">
      <span className="flex items-center gap-2 text-sm">
        <SidebarBadge badge="done" />
        done
      </span>
      <span className="flex items-center gap-2 text-sm">
        <SidebarBadge badge="new" />
        new
      </span>
      <span className="flex items-center gap-2 text-sm">
        <SidebarBadge badge="info" />
        info
      </span>
      <span className="flex items-center gap-2 text-sm">
        <SidebarBadge badge="disabled" />
        disabled
      </span>
    </div>
}`,...u.parameters?.docs?.source}}},d=[`Done`,`New`,`Info`,`Disabled`,`ToutesVariantes`]}))();export{l as Disabled,o as Done,c as Info,s as New,u as ToutesVariantes,d as __namedExportsOrder,a as default};
import{i as e}from"./preload-helper-DaCzexP6.js";import{u as t}from"./iframe-Ar-lzPaK.js";import{n,t as r}from"./bandeau-chiffres-VQa7BqYA.js";import{n as i,t as a}from"./section-vitrine-BsmwWfi1.js";var o,s,c,l,u,d;e((()=>{o=t(),n(),i(),s={title:`Explorations/Site vitrine T3 2026/Briques & sections/Briques/Bandeau de chiffres`,component:r,tags:[`autodocs`],parameters:{espace:`vitrine`,layout:`fullscreen`,docs:{description:{component:[`Bande de chiffres-clés (motif « preuve »). La mise en section`,"(fond, padding) reste portée par `SectionVitrine`.",``,"Ton `accent` (bleu France) par défaut sur fond clair ; ton `inherit`",`sur fond bleu pour hériter le texte clair de la section.`].join(`
`)}}},argTypes:{ton:{control:`inline-radio`,options:[`accent`,`inherit`]}}},c={name:`Trois chiffres (fond clair)`,render:e=>(0,o.jsx)(a,{fond:`alt-grey`,taille:`legere`,children:(0,o.jsx)(r,{...e})}),args:{chiffres:[{valeur:`60 000+`,label:`entreprises engagées`},{valeur:`166`,label:`initiatives au référentiel`},{valeur:`2025`,label:`d'actions déclarées en continu`}]}},l={name:`Quatre chiffres`,render:e=>(0,o.jsx)(a,{fond:`white`,taille:`legere`,children:(0,o.jsx)(r,{...e})}),args:{chiffres:[{valeur:`4`,label:`axes stratégiques`},{valeur:`40`,label:`thématiques`},{valeur:`166`,label:`initiatives`},{valeur:`13`,label:`régions actives`}]}},u={name:`Sur fond bleu (ton inherit)`,render:e=>(0,o.jsx)(a,{fond:`blue`,taille:`legere`,children:(0,o.jsx)(r,{...e})}),args:{ton:`inherit`,chiffres:[{valeur:`60 000+`,label:`entreprises engagées`},{valeur:`166`,label:`initiatives au référentiel`},{valeur:`+18 %`,label:`d'engagements cette année`}]}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  name: 'Trois chiffres (fond clair)',
  render: args => <SectionVitrine fond="alt-grey" taille="legere">
      <BandeauChiffres {...args} />
    </SectionVitrine>,
  args: {
    chiffres: [{
      valeur: '60 000+',
      label: 'entreprises engagées'
    }, {
      valeur: '166',
      label: 'initiatives au référentiel'
    }, {
      valeur: '2025',
      label: "d'actions déclarées en continu"
    }]
  }
}`,...c.parameters?.docs?.source}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: 'Quatre chiffres',
  render: args => <SectionVitrine fond="white" taille="legere">
      <BandeauChiffres {...args} />
    </SectionVitrine>,
  args: {
    chiffres: [{
      valeur: '4',
      label: 'axes stratégiques'
    }, {
      valeur: '40',
      label: 'thématiques'
    }, {
      valeur: '166',
      label: 'initiatives'
    }, {
      valeur: '13',
      label: 'régions actives'
    }]
  }
}`,...l.parameters?.docs?.source}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  name: 'Sur fond bleu (ton inherit)',
  render: args => <SectionVitrine fond="blue" taille="legere">
      <BandeauChiffres {...args} />
    </SectionVitrine>,
  args: {
    ton: 'inherit',
    chiffres: [{
      valeur: '60 000+',
      label: 'entreprises engagées'
    }, {
      valeur: '166',
      label: 'initiatives au référentiel'
    }, {
      valeur: '+18 %',
      label: "d'engagements cette année"
    }]
  }
}`,...u.parameters?.docs?.source}}},d=[`TroisChiffres`,`QuatreChiffres`,`SurFondBleu`]}))();export{l as QuatreChiffres,u as SurFondBleu,c as TroisChiffres,d as __namedExportsOrder,s as default};
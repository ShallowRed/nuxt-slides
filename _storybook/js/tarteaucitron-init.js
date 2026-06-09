if (!window.location.pathname.startsWith('/internal')) {
  tarteaucitron.init({
    privacyUrl: '/politique-confidentialite',
    bodyPosition: 'bottom',
    hashtag: '#tarteaucitron',
    cookieName: 'tarteaucitron',
    orientation: 'middle',
    groupServices: false,
    showDetailsOnClick: true,
    serviceDefaultState: 'wait',
    showAlertSmall: false,
    cookieslist: false,
    closePopup: false,
    showIcon: true,
    iconPosition: 'BottomRight',
    adblocker: false,
    DenyAllCta: true,
    AcceptAllCta: true,
    highPrivacy: true,
    handleBrowserDNTRequest: false,
    removeCredit: false,
    moreInfoLink: true,
    useExternalCss: false,
    useExternalJs: false,
    readmoreLink: '',
    mandatory: true,
    mandatoryCta: true,
  });
  tarteaucitron.user.googletagmanagerId = 'GTM-PHW4NNHH';
  (tarteaucitron.job = tarteaucitron.job || []).push('googletagmanager');
  (tarteaucitron.job = tarteaucitron.job).push('youtube');
}

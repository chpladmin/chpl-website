const developerGuideRoles = ['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'];

const shortcutItems = [{
  key: 'api-information',
  href: '#/api-documentation',
  text: 'API Information',
  analyticsEvent: 'Go to API Info Page',
  router: { sref: 'shortcut.api-documentation' },
}, {
  key: 'banned-developers',
  href: '#/banned-developers',
  text: 'Banned Developers',
  analyticsEvent: 'Go to Banned Developers Page',
  router: { sref: 'shortcut.banned-developers' },
}, {
  key: 'charts',
  href: '#/charts',
  text: 'Charts',
  analyticsEvent: 'Go to Charts Page',
  router: { sref: 'charts' },
}, {
  key: 'decertified-products',
  href: '#/decertified-products',
  text: 'Decertified Products',
  analyticsEvent: 'Go to Decertified Products Page',
  router: { sref: 'shortcut.decertified-products' },
}, {
  key: 'decision-support-interventions',
  href: '#/decision-support-interventions',
  text: 'Decision Support Interventions',
  analyticsEvent: 'Go to Decision Support Interventions Page',
  router: { sref: 'shortcut.decision-support-interventions' },
}, {
  key: 'inactive-certificates',
  href: '#/inactive-certificates',
  text: 'Inactive Certificates',
  analyticsEvent: 'Go to Inactive Certificates Page',
  router: { sref: 'shortcut.inactive-certificates' },
}, {
  key: 'corrective-action',
  href: '#/corrective-action',
  text: 'Products: Corrective Action',
  analyticsEvent: 'Go to Products: Corrective Action Page',
  router: { sref: 'shortcut.corrective-action' },
}, {
  key: 'real-world-testing',
  href: '#/real-world-testing',
  text: 'Real World Testing',
  analyticsEvent: 'Go to Real World Testing Page',
  router: { sref: 'shortcut.real-world-testing' },
}, {
  key: 'sed-information',
  href: '#/sed',
  text: 'SED Information',
  analyticsEvent: 'Go to SED Info Page',
  router: { sref: 'shortcut.sed' },
}, {
  key: 'svap-information',
  href: '#/svap',
  text: 'SVAP Information',
  analyticsEvent: 'Go to SVAP Info Page',
  router: { sref: 'shortcut.svap' },
}];

const getResourceItems = ({ includeDeveloperGuide }) => {
  const baseItems = [{
    key: 'overview',
    href: '#/resources/overview',
    text: 'Overview',
    analyticsEvent: 'Go to Overview Page',
    router: { sref: 'resources.overview' },
  }, {
    key: 'public-user-guide',
    href: 'https://www.healthit.gov/sites/default/files/policy/chpl_public_user_guide.pdf',
    text: 'CHPL Public User Guide',
    analyticsEvent: 'CHPL Public User Guide',
    analyticsCategory: 'Resources',
    router: { sref: 'resources.overview' },
    showDownloadIcon: true,
    primaryIcon: true,
  }];

  if (includeDeveloperGuide) {
    baseItems.push({
      key: 'developer-user-guide',
      href: 'https://www.healthit.gov/wp-content/uploads/2026/02/Certified-Health-IT-Product-List-CHPL-Developer-User-Guide.pdf',
      text: 'CHPL Developer User Guide',
      analyticsEvent: 'CHPL Developer User Guide',
      analyticsCategory: 'Resources',
      router: { sref: 'resources.overview' },
      showDownloadIcon: true,
      primaryIcon: false,
    });
  }

  return [
    ...baseItems, {
      key: 'cms-id-reverse-lookup',
      href: '#/resources/cms-lookup',
      text: 'CMS ID Reverse Lookup',
      analyticsEvent: 'Go to CMS ID Reverse Lookup Page',
      router: { sref: 'resources.cms-lookup' },
    }, {
      key: 'download-chpl',
      href: '#/resources/download',
      text: 'Download the CHPL',
      analyticsEvent: 'Go to Download the CHPL Page',
      router: { sref: 'resources.download' },
    }, {
      key: 'chpl-api',
      href: '#/resources/api',
      text: 'CHPL API',
      analyticsEvent: 'Go to CHPL API Page',
      router: { sref: 'resources.api' },
    }, {
      key: 'contact-us',
      href: 'https://inquiry.healthit.gov/support/plugins/servlet/loginfreeRedirMain?portalid=2&request=51',
      text: 'Contact Us',
      analyticsEvent: 'Go to Contact Us Page',
    },
  ];
};

export {
  developerGuideRoles,
  getResourceItems,
  shortcutItems,
};

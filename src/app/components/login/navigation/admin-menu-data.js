const sectionConfigs = [{
  key: 'activity',
  title: 'Activity',
  roles: ['chpl-admin', 'chpl-onc'],
  items: [{
    key: 'questionable-activity',
    href: '#/reports/questionable-activity',
    text: 'Questionable Activity',
    router: { sref: 'reports.questionable-activity' },
  }, {
    key: 'activity-search',
    href: '#/reports/activity',
    text: 'Search',
    router: { sref: 'reports.activity' },
  }],
}, {
  key: 'administration',
  title: 'Administration',
  roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff'],
  disablePadding: false,
  items: [{
    key: 'change-requests',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    href: '#/administration/change-requests',
    text: 'Change Requests',
    router: { sref: 'administration.change-requests' },
  }, {
    key: 'cms',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-cms-staff'],
    href: '#/administration/cms',
    text: 'CMS',
    router: { sref: 'administration.cms' },
  }, {
    key: 'compliance-dashboard',
    roles: ['chpl-admin'],
    href: '#/compliance-dashboard',
    text: 'Compliance Dashboard',
    router: { sref: 'compliance-dashboard' },
  }, {
    key: 'confirm-listings',
    roles: ['chpl-admin', 'chpl-onc-acb'],
    href: '#/administration/confirm/listings',
    text: 'Confirm Listings',
    router: { sref: 'administration.confirm.listings' },
  }, {
    key: 'ff4j',
    roles: ['chpl-admin'],
    href: '/rest/ff4j-console/home',
    text: 'FF4j',
  }, {
    key: 'reports',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    href: '#/administration/reports',
    text: 'Reports',
    router: { sref: 'administration.reports' },
  }, {
    key: 'system-maintenance',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    href: '#/administration/system-maintenance',
    text: 'System Maintenance',
    router: { sref: 'administration.system-maintenance' },
  }, {
    key: 'upload',
    roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
    href: '#/administration/upload',
    text: 'Upload',
    router: { sref: 'administration.upload' },
  }, {
    key: 'url-checker',
    roles: ['chpl-admin', 'chpl-onc'],
    href: '#/administration/url-checker',
    text: 'URL Checker',
    router: { sref: 'administration.url-checker' },
  }, {
    key: 'user-management',
    roles: ['chpl-admin', 'chpl-onc'],
    href: '#/users',
    text: 'User Management',
    router: { sref: 'users' },
  }],
}, {
  key: 'organizations',
  title: 'Organizations',
  roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  items: [{
    key: 'developers',
    href: '#/organizations/developers',
    text: 'Developers',
    router: { sref: 'organizations.developers' },
  }, {
    key: 'onc-acbs',
    href: '#/organizations/onc-acbs',
    text: 'ONC-ACBs',
    router: { sref: 'organizations.onc-acbs' },
  }, {
    key: 'onc-atls',
    roles: ['chpl-admin', 'chpl-onc'],
    href: '#/organizations/onc-atls',
    text: 'ONC-ATLs',
    router: { sref: 'organizations.onc-atls' },
  }],
}, {
  key: 'surveillance',
  title: 'Surveillance',
  roles: ['chpl-admin', 'chpl-onc', 'chpl-onc-acb'],
  items: [{
    key: 'activity-reporting',
    roles: ['chpl-admin', 'chpl-onc'],
    href: '#/surveillance/activity-reporting',
    text: 'Activity Reporting',
    router: { sref: 'surveillance.activity-reporting' },
  }, {
    key: 'complaints-reporting',
    href: '#/surveillance/complaints',
    text: 'Complaints Reporting',
    router: { sref: 'surveillance.complaints' },
  }, {
    key: 'reporting',
    href: '#/surveillance/reporting',
    text: 'Reporting',
    router: { sref: 'surveillance.reporting' },
  }],
}, {
  key: 'insights',
  title: 'Insights',
  roles: ['chpl-developer'],
  items: [{
    key: 'insights',
    href: 'https://www.healthit.gov/insights',
    text: 'Insights',
  }],
}];

export default sectionConfigs;

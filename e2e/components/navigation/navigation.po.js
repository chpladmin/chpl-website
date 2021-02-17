const elements = {
  reportsToggle: '#reports-toggle',
  reports: '#reports-dropdown-menu>li',
};

class NavigationComponent {
  constructor () { }

  get reportsToggle () {
    return $(elements.reportsToggle);
  }

  get reports () {
    return $$(elements.reports);
  }
}

export default NavigationComponent;

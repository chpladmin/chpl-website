const elements = {
  reportsToggle: '#reports-toggle',
  reports: '#reports-dropdown-menu>li',
  surveillanceToggle : '#surveillance-toggle',
  surveillanceOptions: '#surveillance-dropdown-menu>li',
  
};

class NavigationComponent {
  constructor () { }

  get reportsToggle () {
    return $(elements.reportsToggle);
  }

  get reports () {
    return $$(elements.reports);
  }

  get surveillanceToggle () {
    return $(elements.surveillanceToggle);
  }

  get surveillanceOptions () {
    return $$(elements.surveillanceOptions);
  }
}

export default NavigationComponent;

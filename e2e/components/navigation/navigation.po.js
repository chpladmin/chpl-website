class NavigationComponent {
  constructor() {
    this.elements = {
      reportsToggle: '#reports-toggle',
      reports: '#reports-dropdown-menu>li',
      surveillanceToggle: '#surveillance-toggle',
      surveillanceOptions: '#surveillance-dropdown-menu>li',
    };
  }

  get reportsToggle() {
    return $(this.elements.reportsToggle);
  }

  get reports() {
    return $$(this.elements.reports);
  }

  get surveillanceToggle() {
    return $(this.elements.surveillanceToggle);
  }

  get surveillanceOptions() {
    return $$(this.elements.surveillanceOptions);
  }
}

export default NavigationComponent;

class NavigationComponent {
  constructor() {
    this.elements = {
      reportsToggle: '#reports-toggle',
      reports: '#reports-dropdown-menu>li',
      surveillanceToggle: '#surveillance-toggle',
      surveillanceOptions: '#surveillance-dropdown-menu>li',
      shortcutToggle: '#shortcut-toggle',
      shortcuts: '#shortcut-dropdown-menu>li',
      showNavigation: 'button*=Show navigation',
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

  get shortcutToggle() {
    return $(this.elements.shortcutToggle);
  }

  get shortcuts() {
    return $$(this.elements.shortcuts);
  }

  showNavigation() {
    $(this.elements.showNavigation).click();
    browser.waitUntil(() => !($(this.elements.showNavigation).isDisplayed()));
    browser.waitUntil(() => $(this.elements.shortcutToggle).isClickable());
    browser.pause(500); // need to wait for the navigation to settle; taking screenshots between previous waitUntils works, but without the screenshot it doesn't
  }
}

export default NavigationComponent;

class NavigationComponent {
  constructor() {
    this.elements = {
      developersToggle: '#developers-toggle',
      developers: '#developers-dropdown-menu>li',
      reportsToggle: '#reports-toggle',
      reports: '#reports-dropdown-menu>li',
      resourceToggle: '#resource-toggle',
      resources: '#resource-dropdown-menu>li',
      surveillanceToggle: '#surveillance-toggle',
      surveillanceOptions: '#surveillance-dropdown-menu>li',
      shortcutToggle: '#shortcut-toggle',
      shortcuts: '#shortcut-dropdown-menu>li',
      showNavigation: 'button*=Show navigation',
    };
  }

  get developersToggle() {
    return $(this.elements.developersToggle);
  }

  get developers() {
    return $$(this.elements.developers);
  }

  get reportsToggle() {
    return $(this.elements.reportsToggle);
  }

  get reports() {
    return $$(this.elements.reports);
  }

  get resourceToggle() {
    return $(this.elements.resourceToggle);
  }

  get resources() {
    return $$(this.elements.resources);
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

  async showNavigation() {
    await $(this.elements.showNavigation).click();
    await browser.waitUntil(async () => !((await $(this.elements.showNavigation).isDisplayed())));
    await browser.waitUntil(async () => await $(this.elements.shortcutToggle).isClickable());
    await browser.pause(500); // need to wait for the navigation to settle; taking screenshots between previous waitUntils works, but without the screenshot it doesn't
  }
}

export default NavigationComponent;

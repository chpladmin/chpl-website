class SystemMaintenancePage {
  constructor() {
    this.elements = {
      title: 'h1',
      navigationButton: (target) => `#system-maintenance-navigation-${target}`,
    };
  }

  async open(open) {
    await open('#/administration/system-maintenance');
    await (browser.waitUntil(async () => (await $(this.elements.title)).isDisplayed()));
  }

  async getTitle() {
    return (await $(this.elements.title)).getText();
  }

  async navigate(target) {
    await (await $(this.elements.navigationButton(target))).click();
  }

  async canNavigate(target) {
    return (await $(this.elements.navigationButton(target))).isClickable();
  }
}

export default SystemMaintenancePage;

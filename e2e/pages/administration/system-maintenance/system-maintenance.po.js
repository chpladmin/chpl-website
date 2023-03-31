import { open as openPage } from '../../../utilities/hooks.async';

class SystemMaintenancePage {
  constructor() {
    this.elements = {
      title: 'h1',
      navigationButton: (target) => `#system-maintenance-navigation-${target}`,
    };
  }

  async open() {
    await openPage('#/administration/system-maintenance');
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

  async editStandards(identifier) {
    await (await (await (await (await $(`td=${identifier}`)).parentElement()).$('button')).click());
  }
}

export default SystemMaintenancePage;

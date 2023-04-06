import { open as openPage } from '../../../utilities/hooks.async';
import QmsStandardComponent from '../../../components/standards/qms-standard/qms-standard.po';

class SystemMaintenancePage extends QmsStandardComponent {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
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

  async editItem(identifier) {
    await (await (await (await (await $(`td=${identifier}`)).parentElement()).$('button')).click());
  }

  async setValue(identifier) {
    await (await this.name).click();
    await browser.keys(['Control', 'a']);
    await browser.keys(['Backspace']);
    await (await this.name).setValue(identifier);
  }
}

export default SystemMaintenancePage;

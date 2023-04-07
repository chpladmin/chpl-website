import { open as openPage } from '../../../utilities/hooks.async';

class SystemMaintenancePage {
  constructor() {
    this.elements = {
      ...this.elements,
      title: 'h1',
      navigationButton: (target) => `#system-maintenance-navigation-${target}`,
      itemName: '#name',
      dataTable: 'table',
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

  get addButton() {
    return $(this.elements.addButton);
  }

  get itemName() {
    return $(this.elements.itemName);
  }

  get dataTable() {
    return $(this.elements.dataTable);
  }

  /* eslint-disable indent */
  async getData() {
    return (await
            (await
             this.dataTable
            ).$('tbody')
           ).$$('tr');
  }
  /* eslint-enable indent */

  async editItem(identifier) {
    await (await (await (await (await $(`td=${identifier}`)).parentElement()).$('button')).click());
  }

  async canNavigate(target) {
    return (await $(this.elements.navigationButton(target))).isClickable();
  }

  async editItem(identifier) {
    await (await (await (await (await $(`td=${identifier}`)).parentElement()).$('button')).click());
  }

  async setValue(identifier) {
    await (await this.itemName).click();
    await browser.keys(['Control', 'a']);
    await browser.keys(['Backspace']);
    await (await this.itemName).setValue(identifier);
  }
}

export default SystemMaintenancePage;

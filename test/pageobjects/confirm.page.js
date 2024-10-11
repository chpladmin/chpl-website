import Page from './page.es6';

class ConfirmPage extends Page {
  constructor() {
    super();
    this.name = 'ConfirmPage';
    this.elements = {
      ...this.elements,
      listingsTable: 'table',
      processButton: (id) => `//button[@id="process-pending-listing-${id}"]`,
      actionBarMessagesCloseButton: '#action-bar-messages-close',
      actionBarWarnings: '#action-bar-warnings',
    };
  }

  async open() {
    await super.open('administration/confirm/listings');
    await browser.waitUntil(() => this.listingsTable.isDisplayed());
  }

  get listingsTable() { return $(this.elements.listingsTable); }

  get actionBarMessagesCloseButton() { return $(this.elements.actionBarMessagesCloseButton); }

  get actionBarWarnings() { return $(this.elements.actionBarWarnings); }

  async waitForPendingListingToBecomeClickable(chplProductNumber) {
    await (await $(this.elements.processButton(chplProductNumber)).waitForClickable());
  }

  async getDrawerButton(chplProductNumber) {
    return (await (await (await $(this.elements.processButton(chplProductNumber))).parentElement()).parentElement()).$$('button')[1];
  }

  async openDrawer(chplProductNumber) {
    await (await this.getDrawerButton(chplProductNumber)).click();
  }
}

export default ConfirmPage;

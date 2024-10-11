import Page from './page.es6';

class ConfirmPage extends Page {
  constructor() {
    super();
    this.name = 'ConfirmPage';
    this.elements = {
      ...this.elements,
      listingsTable: 'table',
      processButton: (id) => `//button[@id="process-pending-listing-${id}"]`,
    };
  }

  async open() {
    await super.open('administration/confirm/listings');
    await browser.waitUntil(() => this.listingsTable.isDisplayed());
  }

  get listingsTable() {
    return $(this.elements.listingsTable);
  }

  async waitForPendingListingToBecomeClickable(pendingListingId) {
    await (await (this.processButton(pendingListingId)).waitForClickable());
  }
}

export default ConfirmPage;

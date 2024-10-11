import Page from './page.es6';

class ConfirmPage extends Page {
  constructor() {
    super();
    this.name = 'ConfirmPage';
    this.elements = {
      ...this.elements,
      processButton: (id) => `//button[@id="process-pending-listing-${id}"]`,
    };
  }

  open() {
    return super.open('administration/confirm/listings');
  }

  async waitForPendingListingToBecomeClickable(pendingListingId) {
    await (await (this.processButton(pendingListingId)).waitForClickable());
  }
}

export default ConfirmPage;

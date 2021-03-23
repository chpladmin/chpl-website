const config = require('../../../config/mainConfig');
const confirmElements = {
  inspectNext: '#inspect-next',
  inspectConfirm: '#inspect-confirm',
  yesConfirmation: '//button[text()="Yes"]',
  rejectButton: '//table[@id="pending-listings-table"]/tfoot/tr/th/button',
  warningCheckbox: '#acknowledge-warnings',
  confirmButton: '#inspect-confirm',
  toastContainertitle: '.ng-binding.toast-title',
  rejectButtonOnInspectListing: '#inspect-reject',
  errorMessage: '.bg-danger',
  errorOnInspect: '.action-bar__error-messages > li',
};

class ConfirmPage {
  constructor () { }

  get inspectNextButton () {
    return $(confirmElements.inspectNext);
  }

  get inspectConfirmButton () {
    return $(confirmElements.inspectConfirm);
  }

  get yesConfirmation () {
    return $(confirmElements.yesConfirmation);
  }

  get rejectButton () {
    return $(confirmElements.rejectButton);
  }

  get warningCheckbox () {
    return $(confirmElements.warningCheckbox);
  }

  get confirmButton () {
    return $(confirmElements.confirmButton);
  }

  get toastContainerTitle () {
    return $(confirmElements.toastContainertitle);
  }

  get rejectButtonOnInspectListing () {
    return $(confirmElements.rejectButtonOnInspectListing);
  }

  get errorMessage () {
    return $(confirmElements.errorMessage);
  }

  get errorOnInspect () {
    return $$(confirmElements.errorOnInspect);
  }

  rejectCheckbox (chplId) {
    return $('//td[text()="' + chplId + '"]/following-sibling::td[7]/input');
  }

  gotoConfirmListingPage (inspectListingId ) {
    $('//button[@id="pending-listing-inspect-' + inspectListingId + '"]').scrollAndClick();
    this.inspectNextButton.waitAndClick();
    this.inspectNextButton.waitAndClick();
    this.inspectNextButton.waitAndClick();
    if (this.inspectConfirmButton.isDisplayed()) {
      this.inspectConfirmButton.waitForDisplayed();
    } else {
      this.inspectNextButton.waitAndClick();
      this.inspectConfirmButton.waitForDisplayed();
    }
  }

  gotoPendingListingPage (pendingListingId ) {
    $('//button[@id="process-pending-listing-' + pendingListingId + '"]').waitForClickable();
    $('//button[@id="process-pending-listing-' + pendingListingId + '"]').scrollAndClick();
  }

  findListingtoReject (chplId) {
    return $('//td[text()="' + chplId + '"]');
  }

  rejectListing (chplId) {
    $('//td[text()="' + chplId + '"]/following-sibling::td[7]/input').scrollAndClick();
    if (this.rejectButton.isClickable()) {
      this.rejectButton.waitAndClick();
    } else {
      $('//td[text()="' + chplId + '"]/following-sibling::td[7]/input').waitAndClick();
      this.rejectButton.waitAndClick();
    }
    this.yesConfirmation.waitAndClick();
  }

  confirmListing () {
    this.confirmButton.scrollAndClick();
    this.yesConfirmation.waitAndClick();
  }

  waitForSuccessfulConfirm () {
    browser.waitUntil( () => this.toastContainerTitle.isDisplayed() ,
      {
        timeout: config.longTimeout,
      }
    );
  }

  waitForBarMessages () {
    $('.action-bar__messages').waitForDisplayed();
  }

}

export default ConfirmPage;

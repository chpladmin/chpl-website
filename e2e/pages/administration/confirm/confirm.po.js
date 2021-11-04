const config = require('../../../config/mainConfig');
const confirmElements = {
  inspectNext: '#inspect-next',
  inspectConfirm: '#inspect-confirm',
  yesConfirmation: '//button[text()="Yes"]',
  rejectButton: '#reject-selected-pending-listings',
  warningCheckbox: '#acknowledge-warnings',
  confirmButton: '#inspect-confirm',
  rejectButtonOnInspectListing: '#inspect-reject',
  errorMessage: '.bg-danger',
  errorOnInspect: '.action-bar__error-messages > li',
  warningOnInspect: '.action-bar__warning-messages > li',
};

class ConfirmPage {
  constructor () { }

  get inspectNextButton () {
    return $(confirmElements.inspectNext);
  }

  get inspectLabel () {
    return $('#inspect-label');
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

  get rejectButtonOnInspectListing () {
    return $(confirmElements.rejectButtonOnInspectListing);
  }

  get errorMessage () {
    return $(confirmElements.errorMessage);
  }

  get errorOnInspect () {
    return $$(confirmElements.errorOnInspect);
  }

  get warningOnInspect () {
    return $$(confirmElements.warningOnInspect);
  }

  rejectCheckbox (chplId) {
    return $('//td[text()="' + chplId + '"]/following-sibling::td[7]/input');
  }

  gotoConfirmListingPage (inspectListingId ) {
    $('//button[@id="process-pending-listing-' + inspectListingId + '"]').click();
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

  gotoPendingListingPage (pendingListingId) {
    $('//button[@id="process-pending-listing-' + pendingListingId + '"]').waitForClickable({ timeout: config.longTimeout });
    $('//button[@id="process-pending-listing-' + pendingListingId + '"]').click();
  }

  waitForPendingListingToBecomeClickable (pendingListingId) {
    $('//button[@id="process-pending-listing-' + pendingListingId + '"]').waitForClickable({ timeout: config.longTimeout });
  }

  rejectListingCheckbox (chplId) {
    $('//input[@id="reject-pending-listing-' + chplId + '"]').click();
  }

  findListingToReject (chplId) {
    return $('chpl-confirm-listings-bridge').$('//td[text()="' + chplId + '"]');
  }

  rejectListing (chplId) {
    $('//input[@id="reject-pending-listing-' + chplId + '"]').click();
    if (this.rejectButton.isClickable()) {
      this.rejectButton.waitAndClick();
    } else {
      $('//input[@id="reject-pending-listing-' + chplId + '"]').waitAndClick();
      this.rejectButton.waitAndClick();
    }
  }

  confirmListing () {
    this.confirmButton.click();
    this.yesConfirmation.waitAndClick();
  }

  waitForBarMessages () {
    $('.action-bar__messages').waitForDisplayed();
  }

}

export default ConfirmPage;

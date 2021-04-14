const config = require('../../../config/mainConfig');
const confirmElements = {
  inspectNext: '#inspect-next',
  inspectConfirm: '#inspect-confirm',
  yesConfirmation: '//button[text()="Yes"]',
  rejectButton: '#reject-selected-pending-listings',
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
    $('//button[@id="process-pending-listing-' + inspectListingId + '"]').scrollAndClick();
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
    $('//button[@id="process-pending-listing-' + pendingListingId + '"]').waitForClickable({ timeout: 35000 });
    $('//button[@id="process-pending-listing-' + pendingListingId + '"]').scrollAndClick();
  }

  rejectListingCheckbox (chplId) {
    $('//input[@id="reject-pending-listing-' + chplId + '"]').scrollAndClick();
  }

  findListingToReject (chplId) {
    return $('//td[text()="' + chplId + '"]');
  }

  rejectListing (chplId) {
    $('//input[@id="reject-pending-listing-' + chplId + '"]').scrollAndClick();
    if (this.rejectButton.isClickable()) {
      this.rejectButton.waitAndClick();
    } else {
      $('//input[@id="reject-pending-listing-' + chplId + '"]').waitAndClick();
      this.rejectButton.waitAndClick();
    }
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

const config = require('../../../config/mainConfig');

class ConfirmPage {
  constructor() {
    this.elements = {
      title: 'h1=View Products in the process of upload',
      inspectNext: '#inspect-next',
      inspectLabel: '#inspect-label',
      inspectConfirm: '#inspect-confirm',
      yesConfirmation: '//button[text()="Yes"]',
      rejectButton: '#reject-selected-pending-listings',
      warningCheckbox: '#acknowledge-warnings',
      confirmButton: '#inspect-confirm',
      rejectButtonOnInspectListing: '#inspect-reject',
      actionBarMessages: '#action-bar-messages',
      errorMessage: '.bg-danger',
      errorOnInspect: '#action-bar-errors > ul > li',
      warningOnInspect: '#action-bar-warnings > ul > li',
      useLegacy: '#use-legacy',
      usingModern: 'span*=Using Modern Workflow',
    };
  }

  isLoaded() {
    return $(this.elements.title).isDisplayed();
  }

  get inspectNextButton() {
    return $(this.elements.inspectNext);
  }

  get inspectLabel() {
    return $(this.elements.inspectLabel);
  }

  get inspectConfirmButton() {
    return $(this.elements.inspectConfirm);
  }

  get yesConfirmation() {
    return $(this.elements.yesConfirmation);
  }

  get rejectButton() {
    return $(this.elements.rejectButton);
  }

  get warningCheckbox() {
    return $(this.elements.warningCheckbox);
  }

  get confirmButton() {
    return $(this.elements.confirmButton);
  }

  get rejectButtonOnInspectListing() {
    return $(this.elements.rejectButtonOnInspectListing);
  }

  get errorMessage() {
    return $(this.elements.errorMessage);
  }

  get errorOnInspect() {
    return $$(this.elements.errorOnInspect);
  }

  get warningOnInspect() {
    return $$(this.elements.warningOnInspect);
  }

  rejectCheckbox(chplId) {
    return $(`//td[text()="${chplId}"]/following-sibling::td[7]/input`);
  }

  gotoConfirmListingPage(inspectListingId) {
    $(`//button[@id="process-pending-listing-${inspectListingId}"]`).click();
    $('p=Step 1 of 4').waitForDisplayed();
    this.inspectNextButton.click();
    $('p=Step 2 of 4').waitForDisplayed();
    this.inspectNextButton.click();
    $('p=Step 3 of 4').waitForDisplayed();
    this.inspectNextButton.click();
    $('p=Step 4 of 4').waitForDisplayed();
    this.inspectConfirmButton.waitForDisplayed();
  }

  gotoPendingListingPage(pendingListingId) {
    $(`//button[@id="process-pending-listing-${pendingListingId}"]`).waitForClickable({ timeout: config.longTimeout });
    $(`//button[@id="process-pending-listing-${pendingListingId}"]`).click();
  }

  waitForPendingListingToBecomeClickable(pendingListingId) {
    $(`//button[@id="process-pending-listing-${pendingListingId}"]`).waitForClickable({ timeout: config.longTimeout });
  }

  rejectListingCheckbox(chplId, legacy = false) {
    if (legacy && $(this.elements.usingModern).isDisplayed()) {
      $(this.elements.useLegacy).click();
    }
    $(`//input[@id="reject-pending-listing-${chplId}"]`).click();
  }

  findListingToReject(chplId) {
    return $(`//input[@id="reject-pending-listing-${chplId}"]`);
  }

  rejectListing(chplId, legacy = false) {
    if (legacy && $(this.elements.usingModern).isDisplayed()) {
      $(this.elements.useLegacy).click();
    }
    $(`//input[@id="reject-pending-listing-${chplId}"]`).click();
    if (this.rejectButton.isClickable()) {
      this.rejectButton.waitAndClick();
    } else {
      $(`//input[@id="reject-pending-listing-${chplId}"]`).waitAndClick();
      this.rejectButton.waitAndClick();
    }
  }

  confirmListing() {
    this.confirmButton.click();
    this.yesConfirmation.waitAndClick();
  }

  waitForBarMessages() {
    $(this.elements.actionBarMessages).waitForDisplayed();
  }
}

export default ConfirmPage;

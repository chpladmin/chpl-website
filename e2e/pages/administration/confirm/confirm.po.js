const config = require('../../../config/mainConfig');

class ConfirmPage {
  constructor() {
    this.elements = {
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
    };
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

  rejectListingCheckbox(chplId) {
    $(`//input[@id="reject-pending-listing-${chplId}"]`).click();
  }

  findListingToReject(chplId) {
    return $(`//input[@id="reject-pending-listing-${chplId}"]`);
  }

  rejectListing(chplId) {
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

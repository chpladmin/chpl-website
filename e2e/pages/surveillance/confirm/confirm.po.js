const confirmElements = {
  selectAlltoReject: '#pending-surveillance-select-all',
  yesConfirmation: '//button[text()="Yes"]',
  rejectOnInspect: '//button[text()=" Reject"]',
  rejectButton: '#pending-listing-reject-all',
  table: '//*[@id="pending-surveillance-table"]',
  confirm: '//button[text()=" Confirm"]',
  errorOnConfirm: '.bg-danger',
};

class ConfirmPage {
  constructor () { }

  get selectAlltoRejectButton () {
    return $(confirmElements.selectAlltoReject);
  }

  get table () {
    return $(confirmElements.table);
  }

  get confirmButton () {
    return $(confirmElements.confirm);
  }

  get tableRowCount () {
    return $(confirmElements.table).$('tbody').$$('tr');
  }

  get rejectOnInspectButton () {
    return $(confirmElements.rejectOnInspect);
  }

  get yesConfirmation () {
    return $(confirmElements.yesConfirmation);
  }

  get rejectButton () {
    return $(confirmElements.rejectButton);
  }

  get errorOnConfirm () {
    return $(confirmElements.errorOnConfirm);
  }

  rejectCheckbox (chplId) {
    $('//input[@id=\'pending-surveillance-reject-' + chplId + '\']').click();
  }

  rejectSurveillance (chplId) {
    this.rejectCheckbox(chplId);
    if (this.rejectButton.isClickable()) {
      this.rejectButton.waitAndClick();
    } else {
      this.rejectCheckbox(chplId);
      this.rejectButton.waitAndClick();
    }
    this.yesConfirmation.waitAndClick();
  }

  findSurveillancetoReject (chplId) {
    return $('//td[text()="' + chplId + '"]');
  }

  inspectButton (chplId) {
    $('//button[@id="pending-surveillance-inspect-' + chplId + '"]').click();
  }
}

export default ConfirmPage;

class ComplaintsComponent {
  constructor() {
    this.elements = {
      certificationBody: '#certification-body',
      receivedDate: '#received-date',
      acbComplaintId: '#acb-complaint-id',
      complainantType: '#complainant-type',
      summary: '#summary',
      saveComplaint: '#action-bar-save',
      closedDate: '#closed-date',
      filter: '#data-filter',
      downloadResultsButton: '#download-results',
      newComplaint: '//*[text()="Add New Complaint"]',
    };
  }

  set(fields) {
    $(this.elements.certificationBody).click();
    $(`//li[text()="${fields.body}"]`).click();
    $(this.elements.receivedDate).addValue(fields.receivedDate);
    $(this.elements.acbComplaintId).addValue(fields.acbId);
    $(this.elements.summary).addValue(fields.summary);
    $(this.elements.complainantType).click();
    $(`//li[text()="${fields.type}"]`).click();
  }

  saveComplaint() {
    return $(this.elements.saveComplaint).scrollAndClick();
  }

  get closedDate() {
    return $(this.elements.closedDate);
  }

  fieldError(fieldName) {
    return $(`#${fieldName}-helper-text`).getText();
  }

  get downloadResultsButton() {
    return $(this.elements.downloadResultsButton);
  }

  addNewComplaint() {
    return $(this.elements.newComplaint).scrollAndClick();
  }

  get filter() {
    return $(this.elements.filter);
  }

  editComplaint(id) {
    this.filter.addValue(id);
    $('//*[text()="Edit"]/parent::button').scrollAndClick();
  }

  deleteComplaint(id) {
    this.filter.addValue(id);
    $('//*[text()="Delete"]/parent::button').scrollAndClick();
  }
}

export default ComplaintsComponent;

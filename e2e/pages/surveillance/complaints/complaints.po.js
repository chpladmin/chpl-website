class ComplaintsPage {
  constructor() {
    this.elements = {
      newComplaint: '#add-new-complaint',
      certificationBody: '#certification-body',
      receivedDate: '#received-date',
      acbComplaintId: '#acb-complaint-id',
      complainantType: '#complainant-type',
      summary: '#summary',
      saveComplaint: '#action-bar-save',
      closedDate: '#closed-date',
      filter: '#data-filter',
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

  addNewComplaint() {
    return $(this.elements.newComplaint).click();
  }

  get closedDate() {
    return $(this.elements.closedDate);
  }

  fieldError(fieldName) {
    return $(`#${fieldName}-helper-text`).getText();
  }

  get filter() {
    return $(this.elements.filter);
  }

  getcellValue(row,col) {
    return $(`//tbody/tr[${row}]/td[${col}]`).getText();
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

export default ComplaintsPage;

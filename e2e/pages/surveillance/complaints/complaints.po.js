class ComplaintsPage {
  constructor() {
    this.elements = {
      newComplaint: '#add-new-complaint',
      certificationBody: '#certification-body',
      receivedDate: '#received-date',
      acbComplaintId: '#acb-complaint-id',
      complainantType: '#complainant-type',
      summary: '#summary',
      saveComplaint: '#save-complaint',
      closedDate: '#closed-date',
      error: '.text-danger.text-left',
      specificFieldError: '.text-danger.ng-scope',
      filter: '#data-filter',
      delete: '//*[text()="Delete Complaint"]',
    };
  }

  set(fields) {
    $(this.elements.certificationBody).selectByVisibleText(fields.body);
    $(this.elements.receivedDate).addValue(fields.receivedDate);
    $(this.elements.acbComplaintId).addValue(fields.acbId);
    $(this.elements.complainantType).selectByVisibleText(fields.type);
    $(this.elements.summary).addValue(fields.summary);
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

  get error() {
    return $(this.elements.error);
  }

  get specificFieldError() {
    return $(this.elements.specificFieldError);
  }

  get filter() {
    return $(this.elements.filter);
  }

  get delete() {
    return $(this.elements.delete);
  }

  getRowCount() {
    return $$('//table/tbody/tr').length;
  }

  editComplaint(id) {
    this.filter.addValue(id);
    $('//table/tbody/tr/td[7]/button[@title="Edit Complaint"]').scrollAndClick();
  }

  deleteComplaint(id) {
    this.filter.addValue(id);
    $('//table/tbody/tr/td[7]/button[@title="Delete Complaint"]').scrollAndClick();
  }
}

export default ComplaintsPage;

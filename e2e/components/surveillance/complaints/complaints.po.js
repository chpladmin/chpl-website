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
      editButton: '//*[text()="Edit"]/parent::button',
      actions: '#actions',
      oncId: '#onc-complaint-id',
      criterion: '#criteria',
      listings: '#listings',
      surveillance: '#surveillances',
      complainantContacted: '#complainant-contacted',
      developerContacted: '#developer-contacted',
      oncAtlContacted: '#onc-atl-contacted',
      informedOnc: '#flag-for-onc-review'
    };
  }

  get editButton() {
    return $(this.elements.editButton);
  }

  complaintsBody () {
    return $('chpl-complaints-wrapper-bridge').getText();
  }

  get viewButton() {
    return $('//span[text()="View"]');
  }

  selectSurveillance(surveillance) {
    $(this.elements.surveillance).click();
    $(`//li[contains(text(),"${surveillance}")]`).click();
  }

  selectListing(listings) {
    $(this.elements.listings).click();
    $(this.elements.listings).addValue(listings);
    $(`//li[contains(text(),"${listings}")]`).click();
  }

  set(fields) {
    $(this.elements.certificationBody).click();
    $(`//li[text()="${fields.body}"]`).click();
    $(this.elements.receivedDate).addValue(fields.receivedDate);
    $(this.elements.acbComplaintId).addValue(fields.acbId);
    $(this.elements.summary).addValue(fields.summary);
    $(this.elements.complainantType).scrollIntoView();
    $(this.elements.complainantType).click();
    $(`//li[text()="${fields.type}"]`).click();
  }

  setOptionalFields(fields) {
    $(this.elements.oncId).addValue(fields.oncId);
    $(this.elements.actions).addValue(fields.actions);
    $(this.elements.criterion).click();
    $(`//li[text()="${fields.criterion}"]`).click();
    $(this.elements.listings).click();
    $(this.elements.listings).addValue(fields.listings);
    $(`//li[contains(text(),"${fields.listings}")]`).click();
    $(this.elements.surveillance).click();
    $(`//li[contains(text(),"${fields.surveillance}")]`).click();
    $(this.elements.complainantContacted).click();
    $(this.elements.developerContacted).click();
    $(this.elements.oncAtlContacted).click();
    $(this.elements.informedOnc).click();
  }

  saveComplaint() {
    return $(this.elements.saveComplaint).click();
  }

  get closedDate() {
    return $(this.elements.closedDate);
  }

  setActions(actions) {
    return $(this.elements.actions).addValue(actions);
  }

  fieldError(fieldName) {
    return $(`#${fieldName}-helper-text`).getText();
  }

  get downloadResultsButton() {
    return $(this.elements.downloadResultsButton);
  }

  get newComplaintButton() {
    return $(this.elements.newComplaint);
  }

  addNewComplaint() {
    return $(this.elements.newComplaint).click();
  }

  get filter() {
    return $(this.elements.filter);
  }

  editComplaint(id) {
    this.viewComplaint(id);
    $('//*[text()="Edit"]/parent::button').click();
  }

  viewComplaint(id) {
    this.filter.clearValue();
    this.filter.addValue(id); 
    browser.waitUntil(() => $('chpl-surveillance-complaints').$('table').$('tbody').$$('tr').length-1 === 1);
    $('//span[text()="View"]/parent::button').click();
  }

  waitForUpdatedTableRowCount () {
    let start;
    start = $('table').$('tbody').$$('tr').length;
    browser.waitUntil( () => $('table').$('tbody').$$('tr').length != start);
  }

  advancedSearch () {
    $('//button[text()="Advanced Search"]').click();
  }

  searchFilter (value) {
    $('#data-filter').clearValue();
    $('#data-filter').addValue(value);
  }

  advanceFilterOptions (value){
    $(`#filter-list-${value}`).click();
  }

  chooseAdvanceSearchOption (option) {
    $(`//button[text()="${option}"]`).click();
  }
}

export default ComplaintsComponent;

import CollectionPage from '../../../pages/collections/collection.po';

class ComplaintsComponent extends CollectionPage {
  constructor() {
    super();
    this.elements = {
      ...this.elements,
      complaintsBody: 'chpl-complaints-wrapper-bridge',
      certificationBody: '#certification-body',
      receivedDate: '#received-date',
      acbComplaintId: '#acb-complaint-id',
      complainantType: '#complainant-type',
      summary: '#summary',
      saveComplaint: '#action-bar-save',
      closedDate: '#closed-date',
      downloadResultsButton: '#download-results',
      newComplaint: '//*[text()="Add New Complaint"]',
      viewButton: '//span[text()="View"]',
      editButton: '//*[text()="Edit"]/parent::button',
      actions: '#actions',
      oncId: '#onc-complaint-id',
      criterion: '#criteria',
      complainantContacted: '#complainant-contacted',
      developerContacted: '#developer-contacted',
      oncAtlContacted: '#onc-atl-contacted',
      informedOnc: '#flag-for-onc-review',
      advancedSearch: '//button[text()="Advanced Search"]',
      fieldError: (fieldName) => `#${fieldName}-helper-text`,
      advanceFilterOptions: (value) => `#filter-list-${value}`,
      chooseAdvanceSearchOption: (option) => `//button[text()="${option}"]`,
      complaintsTable: '[aria-label="Complaints table"]',
      backToComplaintsButton: 'button*=Back to Complaints',
    };
  }

  get editButton() {
    return $(this.elements.editButton);
  }

  get backToComplaintsButton() {
    return $(this.elements.backToComplaintsButton);
  }

  async complaintsBody() {
    return (await $(this.elements.complaintsBody)).getText();
  }

  get viewButton() {
    return $(this.elements.viewButton);
  }

  async set(fields) {
    await (await $(this.elements.certificationBody)).click();
    await (await $(`//li[text()="${fields.body}"]`)).click();
    await (await $(this.elements.receivedDate)).addValue(fields.receivedDate);
    await (await $(this.elements.acbComplaintId)).addValue(fields.acbId);
    await (await $(this.elements.summary)).addValue(fields.summary);
    await (await $(this.elements.complainantType)).scrollIntoView();
    await (await $(this.elements.complainantType)).click();
    await (await $(`//li[text()="${fields.type}"]`)).click();
  }

  async setOptionalFields(fields) {
    await (await $(this.elements.oncId)).addValue(fields.oncId);
    await (await $(this.elements.actions)).addValue(fields.actions);
    await (await $(this.elements.criterion)).click();
    await (await $(`//li[text()="${fields.criterion}"]`)).click();
    await (await $(this.elements.complainantContacted)).click();
    await (await $(this.elements.developerContacted)).click();
    await (await $(this.elements.oncAtlContacted)).click();
    await (await $(this.elements.informedOnc)).click();
  }

  async saveComplaint() {
    return (await $(this.elements.saveComplaint)).click();
  }

  get closedDate() {
    return $(this.elements.closedDate);
  }

  async setActions(actions) {
    return (await $(this.elements.actions)).addValue(actions);
  }

  async fieldError(fieldName) {
    return (await $(this.elements.fieldError(fieldName))).getText();
  }

  get downloadResultsButton() {
    return $(this.elements.downloadResultsButton);
  }

  get newComplaintButton() {
    return $(this.elements.newComplaint);
  }

  async addNewComplaint() {
    await $(this.elements.newComplaint).click();
    await browser.waitUntil(async () => (await this.complaintsBody()).includes('Create Complaint'));
  }

  async editComplaint(id) {
    await this.viewComplaint(id);
    await (await $('//*[text()="Edit"]/parent::button')).click();
    await browser.waitUntil(async () => (await this.complaintsBody()).includes('Edit Complaint'));
  }

  async viewComplaint(id) {
    await (this.searchFilter(id));
    await browser.waitUntil(async () => (await (await (await $(this.elements.complaintsTable)).$('tbody')).$$('tr')).length === 1);
    await (await $('//span[text()="View"]/parent::button')).click();
  }

  async waitForUpdatedTableRowCount() {
    const start = (await (await (await $('table')).$('tbody')).$$('tr')).length;
    await browser.waitUntil(async () => (await (await (await $(this.elements.complaintsTable)).$('tbody')).$$('tr')).length !== start);
  }

  async advancedSearch() {
    await (await $(this.elements.advancedSearch)).click();
  }

  async searchFilter(value) {
    await this.searchForText(value);
  }

  async advanceFilterOptions(value) {
    await (await $(this.elements.advanceFilterOptions(value))).click();
  }

  async chooseAdvanceSearchOption(option) {
    await (await $(this.elements.chooseAdvanceSearchOption(option))).click();
  }

  async hasResults() {
    return (await $(this.elements.complaintsTable)).isExisting();
  }

  async getResults() {
    return (await (await $(this.elements.complaintsTable)).$('tbody')).$$('tr');
  }

  async getHeaders() {
    return (await (await $(this.elements.complaintsTable)).$('thead')).$$('th');
  }

  async getTableComplaints() {
    return (await (await $(this.elements.complaintsTable)).$('tbody')).$$('tr');
  }

  async getComplaintCell(complaint, idx) {
    return (await complaint.$$('td'))[idx];
  }
}

export default ComplaintsComponent;

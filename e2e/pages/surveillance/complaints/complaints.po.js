class ComplaintsPage {
  constructor() {
    this.elements = {
      newComplaint: '#add-new-complaint',
      filter: '#data-filter',
      downloadResultsButton: '#download-results',
    };
  }

  getComplaintsTableHeaders() {
    return $('table').$('thead').$$('th');
  }

  getComplaints() {
    return $('table').$('tbody').$$('tr');
  }

  get downloadResultsButton() {
    return $(this.elements.downloadResultsButton);
  }

  addNewComplaint() {
    return $(this.elements.newComplaint).click();
  }

  get filter() {
    return $(this.elements.filter);
  }

  getcellValue(row, col) {
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

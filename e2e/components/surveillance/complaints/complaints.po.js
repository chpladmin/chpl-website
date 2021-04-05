const elements = {
  complaintsTable: '#complaints-table',
  downloadResultsButton: '#download-results',
};

class ComplaintsComponent {
  constructor () { }

  getComplaintsTableHeaders () {
    return $(elements.complaintsTable).$('thead').$$('th');
  }

  getComplaints () {
    return $(elements.complaintsTable).$('tbody').$$('tr');
  }

  get downloadResultsButton () {
    return $(elements.downloadResultsButton);
  }
}

export default ComplaintsComponent;

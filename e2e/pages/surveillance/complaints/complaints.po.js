class ComplaintsPage {
  constructor() {
    this.elements = {
      newComplaint: '#add-new-complaint',
    };
  }

  addNewComplaint() {
    return $(this.elements.newComplaint).click();
  }
}

export default ComplaintsPage;

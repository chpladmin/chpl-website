class CriteriaComponent {
  constructor() {
    this.elements = {
      cqmHeader: '//div[text()="Clinical Quality Measures"]',
      panel: '#panel-cqm',
    };
  }

  get cqmHeader() {
    return $(this.elements.cqmHeader);
  }

  expandCqm() {
    this.cqmHeader.parentElement().click();
  }

  cqmCount() {
    return $(this.elements.panel).$('table').$('tbody').$$('tr').length;
  }
}

export default CriteriaComponent;

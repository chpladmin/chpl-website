
class CriteriaComponent {
  constructor() {
    this.elements = {
      cqmHeader: '//div[text()="Clinical Quality Measures"]',
    };
  }

  get cqmHeader() {
    return $(this.elements.cqmHeader);
  }

  expandCqm() {
    $('//div[text()="Clinical Quality Measures"]/following-sibling::div').scrollAndClick();
  }

  cqmCount() {
    return $('#panel-cqm').$('table').$('tbody').$$('tr').length;
  }
}

export default CriteriaComponent;

const elements = {
  cqmHeader: '//div[text()="Clinical Quality Measures"]',
};

class CriteriaComponent {
  constructor() { }

  get cqmHeader() {
    return $(elements.cqmHeader);
  }

  expandCqm() {
    $('//div[text()="Clinical Quality Measures"]/following-sibling::div').scrollAndClick();
  }

  cqmCount() {
    return $('#panel-cqm').$('table').$('tbody').$$('tr').length;
  }
}

export default CriteriaComponent;

const elements = {
  measuresHeader: '//div[text()="Successfully Tested G1/G2 Measures"]',
};

class MeasuresComponent {
  constructor() { }

  get measuresHeader() {
    return $(elements.measuresHeader);
  }

  expandMeasures() {
    $('//div[text()="Successfully Tested G1/G2 Measures"]/following-sibling::div').scrollAndClick();
  }

  measuresCount() {
    return $('chpl-g1g2-view').$('tbody').$$('tr').length;
  }
}

export default MeasuresComponent;

const elements = {
  chartTitle: 'svg > g:nth-child(3) > text:nth-child(1)',
  dropdown: '//label/select',
  nonconformityChart: '//button[text()="Nonconformity charts"]',
};

class ChartsPage {
  constructor () { }

  get chartTitle () {
    return $(elements.chartTitle);
  }

  get dropdownOptions () {
    return $(elements.dropdown).$$('option');
  }

  get nonconformityChartButton () {
    return $(elements.nonconformityChart);
  }
}

export default ChartsPage;

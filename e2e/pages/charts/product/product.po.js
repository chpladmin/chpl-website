const productChartsElements = {
  chartTitle: 'svg > g:nth-child(3) > text:nth-child(1)',
  viewCertificationCriteriaDropdown: '//label/select',
  nonconformityChart: '//button[text()="Nonconformity charts"]',
};

class ProductChartsPage {
  constructor () { }

  get chartTitle () {
    return $(productChartsElements.chartTitle);
  }

  get viewCertificationCriteriaDropdownOptions () {
    return $(productChartsElements.viewCertificationCriteriaDropdown).$$('option');
  }

  get nonconformityChartButton () {
    return $(productChartsElements.nonconformityChart);
  }
}

export default ProductChartsPage;

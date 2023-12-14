class ChartsPage {
  constructor() {
    this.elements = {
      chartTitle: 'svg > g:nth-child(3) > text:nth-child(1)',
      programTypeDropdown: '//label[1]/select',
      chart: 'aria/A chart.',
      axisDropdown: '//label[2]/select',
      certificationStatusDropdown: '//label[1]/select',
      stackingTypeDropdown: '//label[2]/select',
    };
  }

  get chartTitle() {
    return $(this.elements.chartTitle);
  }

  get programTypeDropdownOptions() {
    return $(this.elements.programTypeDropdown).$$('option');
  }

  get axisDropdownOptions() {
    return $(this.elements.axisDropdown).$$('option');
  }

  get certificationStatusDropdownOptions() {
    return $(this.elements.certificationStatusDropdown).$$('option');
  }

  get stackingTypeDropdownOptions() {
    return $(this.elements.stackingTypeDropdown).$$('option');
  }

  async chartTabs(name) {
    return $(`//button[text()="${name}"]`);
  }

  get chart() {
    return $$(this.elements.chart);
  }
}

export default ChartsPage;

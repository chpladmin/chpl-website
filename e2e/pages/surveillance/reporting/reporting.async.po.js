class ReportingPage {
  constructor() {
    this.elements = {
      acbHeader: '.panel.panel-default',
      secondaryPageTitle: 'h2',
    };
  }

  get secondaryPageTitle() {
    return $(this.elements.secondaryPageTitle);
  }

  get acbHeader() {
    return $(this.elements.acbHeader);
  }

  async getAcbReportingCount() {
    return (await $$(this.elements.acbHeader)).length;
  }

  async expandAcb(acb) {
    await $(`//*[@id="onc-acb-${acb}"]`).click();
  }

  async editQuarterlyReport(acb, year, quarter) {
    return $(`//*[@id="act-${acb}-${year}-${quarter}"]`);
  }

  async editAnnualReport(acb, year) {
    return $(`//*[@id="act-${acb}-${year}"]`);
  }

  async initiateQuarterlyReport(acb, year, quarter) {
    return $(`//*[@id="initiate-${acb}-${year}-${quarter}"]`);
  }

  async initiateAnnualReport(acb, year) {
    return $(`//*[@id="initiate-${acb}-${year}"]`);
  }
}

export default ReportingPage;

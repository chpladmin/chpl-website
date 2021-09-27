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

  get acbReportingCount() {
    return $$(this.elements.acbHeader).length;
  }

  expandAcb(acb) {
    $(`//*[@id="onc-acb-${acb}"]`).click();
  }

  editQuarterlyReport(acb, year, quarter) {
    return $(`//*[@id="act-${acb}-${year}-${quarter}"]`);
  }

  editAnnualReport(acb, year) {
    return $(`//*[@id="act-${acb}-${year}"]`);
  }

  initiateQuarterlyReport(acb, year, quarter) {
    return $(`//*[@id="initiate-${acb}-${year}-${quarter}"]`);
  }

  initiateAnnualReport(acb, year) {
    return $(`//*[@id="initiate-${acb}-${year}"]`);
  }
}

export default ReportingPage;

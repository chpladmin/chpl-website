class ComplianceComponent {
  constructor() {
    this.elements = {
      complianceHeader: '//div[text()="Compliance Activities"]',
      surveillanceHeader: '//div[text()="Surveillance Activities"]',
      drHeader: '//div[text()="Direct Review Activities"]',
    };
  }

  get complianceHeader() {
    return $(this.elements.complianceHeader);
  }

  get surveillanceHeader() {
    return $(this.elements.surveillanceHeader);
  }

  get drHeader() {
    return $(this.elements.drHeader);
  }

  expandCompliance() {
    $('//div[text()="Compliance Activities"]/following-sibling::div').click();
  }

  expandSurveillance() {
    $('//div[text()="Surveillance Activities"]/following-sibling::div').click();
  }

  expandDr() {
    $('//div[text()="Direct Review Activities"]/following-sibling::div').click();
  }

  get survActivity() {
    return $('ai-surveillance');
  }
}

export default ComplianceComponent;

const elements = {
  complianceHeader: '//div[text()="Compliance Activities"]',
  surveillanceHeader: '//div[text()="Surveillance Activities"]',
  drHeader: '//div[text()="Direct Review Activities"]',
};

class ComplianceComponent {
  constructor () { }

  get complianceHeader () {
    return $(elements.complianceHeader);
  }

  get surveillanceHeader () {
    return $(elements.surveillanceHeader);
  }
  get drHeader () {
    return $(elements.drHeader);
  }

  expandCompliance () {
    $('//div[text()="Compliance Activities"]/following-sibling::div').scrollAndClick();
  }

  expandSurveillance () {
    $('//div[text()="Surveillance Activities"]/following-sibling::div').scrollAndClick();
  }

  expandDr () {
    $('//div[text()="Direct Review Activities"]/following-sibling::div').scrollAndClick();
  }

  get survActivity () {
    return $('ai-surveillance');
  }

}

export default ComplianceComponent;

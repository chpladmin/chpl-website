const elements = {
  additionalHeader: '//div[text()="Additional Information"]',
  icsButton: '//button[text()="View ICS Relationships"]',
};

class AdditionalComponent {
  constructor() { }

  get additionalHeader() {
    return $(elements.additionalHeader);
  }

  get icsButton() {
    return $(elements.icsButton);
  }

  expandAdditional() {
    $('//div[text()="Additional Information"]/following-sibling::div').scrollAndClick();
  }
}

export default AdditionalComponent;

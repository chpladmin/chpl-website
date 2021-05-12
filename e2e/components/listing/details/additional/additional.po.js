const elements = {
  additionalHeader: '//div[text()="Additional Information"]',
  IcsButton: '//button[text()="View ICS Relationships"]',
};

class AdditionalComponent {
  constructor () { }

  get additionalHeader () {
    return $(elements.additionalHeader);
  }

  get IcsButton () {
    return $(elements.IcsButton);
  }

  expandAdditional () {
    $('//div[text()="Additional Information"]/following-sibling::div').scrollAndClick();
  }

}

export default AdditionalComponent;

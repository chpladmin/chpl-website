const elements = {
  yes: '//button[text()="Yes"]',
  no: '//button[text()="No"]',
};

class ActionConfirmationComponent {
  constructor () { }

  get yes () {
    return $(elements.yes);
  }

  get no () {
    return $(elements.no);
  }
}

export default ActionConfirmationComponent;

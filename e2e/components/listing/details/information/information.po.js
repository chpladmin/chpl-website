class InformationComponent {
  constructor() {
    this.elements = {
      address: 'chpl-address',
      contact: 'chpl-contact',
      link: 'chpl-link-bridge',
    };
  }

  get address() {
    return $(this.elements.address);
  }

  get contact() {
    return $(this.elements.contact);
  }

  get link() {
    return $(this.elements.link).$('a');
  }

  getInformation(section) {
    return $(`#listing-information-${section}`);
  }
}

export default InformationComponent;

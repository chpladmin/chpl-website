class AddressComponent {
  constructor() {
    this.elements = {
      editAddress: '#line1',
      editCity: '#city',
      editState: '#state',
      editZip: '#zipcode',
      editCountry: '#country',
    };
  }

  async getEditAddress() {
    return $(this.elements.editAddress);
  }

  async getEditCity() {
    return $(this.elements.editCity);
  }

  async getEditState() {
    return $(this.elements.editState);
  }

  async getEditZip() {
    return $(this.elements.editZip);
  }

  async getEditCountry() {
    return $(this.elements.editCountry);
  }

  async set(address) {
    await (await this.getEditAddress()).setValue(address.address);
    await (await this.getEditCity()).setValue(address.city);
    await (await this.getEditState()).setValue(address.state);
    await (await this.getEditZip()).setValue(address.zip);
    await (await this.getEditCountry()).setValue(address.country);
  }
}

export default AddressComponent;

const elements = {
  editAddress: '#line1',
  editCity: '#city',
  editState: '#state',
  editZip: '#zipcode',
  editCountry: '#country',
};

class AddressComponent {
  constructor () { }

  get editAddress () {
    return $(elements.editAddress);
  }

  get editCity () {
    return $(elements.editCity);
  }

  get editState () {
    return $(elements.editState);
  }

  get editZip () {
    return $(elements.editZip);
  }

  get editCountry () {
    return $(elements.editCountry);
  }

  set (address) {
    this.editAddress.setValue(address.address);
    this.editCity.setValue(address.city);
    this.editState.setValue(address.state);
    this.editZip.setValue(address.zip);
    this.editCountry.setValue(address.country);
  }
}

export default AddressComponent;

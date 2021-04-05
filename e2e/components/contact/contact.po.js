const elements = {
  container: 'chpl-contact',
  editFull: '#contactFull',
  editTitle: '#contactTitle',
  editEmail: '#contactEmail',
  editPhone: '#contactPhoneNumber',
  friendlyName: '#contactFriendly',
  editWebsite: '#developer-website',
  editAddress: '#line1',
  editCity: '#city',
  editState: '#state',
  editZip: '#zipcode',
  editCountry: '#country',
};

class ContactComponent {
  constructor () { }

  get (element) {
    return element.$(elements.container);
  }

  get editFull () {
    return $(elements.editFull);
  }

  get editTitle () {
    return $(elements.editTitle);
  }

  get editEmail () {
    return $(elements.editEmail);
  }

  get editPhone () {
    return $(elements.editPhone);
  }

  get friendlyName () {
    return $(elements.friendlyName);
  }

  get editWebsite () {
    return $(elements.editWebsite);
  }

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

  set (contact) {
    this.editFull.setValue(contact.full);
    this.editTitle.setValue(contact.title);
    this.editEmail.setValue(contact.email);
    this.editPhone.setValue(contact.phone);
    if ('website' in contact) {
      this.editWebsite.setValue(contact.website);
    }
    if ('address' in contact) {
      this.editAddress.setValue(contact.address);
      this.editCity.setValue(contact.city);
      this.editState.setValue(contact.state);
      this.editZip.setValue(contact.zip);
      this.editCountry.setValue(contact.country);
    }
  }
}

export default ContactComponent;

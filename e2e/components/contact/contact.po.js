const elements = {
  container: 'chpl-contact',
  editFull: '#contactFull',
  editTitle: '#contactTitle',
  editEmail: '#contactEmail',
  editPhone: '#contactPhoneNumber',
  friendlyName: '#contactFriendly',
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

  set (contact) {
    this.editFull.setValue(contact.full);
    this.editTitle.setValue(contact.title);
    this.editEmail.setValue(contact.email);
    this.editPhone.setValue(contact.phone);
  }
}

export default ContactComponent;

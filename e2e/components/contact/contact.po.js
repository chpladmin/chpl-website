const elements = {
    container: 'chpl-contact',
    editFull: '#contactFull',
    editTitle: '#contactTitle',
    editEmail: '#contactEmail',
    editPhone: '#contactPhoneNumber',
};

class ContactComponent {
    constructor () { }

    getFull (element) {
        return this.getDataItem(element, 'Full name');
    }

    getFriendly (element) {
        return this.getDataItem(element, 'Friendly name');
    }

    getTitle (element) {
        return this.getDataItem(element, 'Title');
    }

    getEmail (element) {
        return this.getDataItem(element, 'Email');
    }

    getPhone (element) {
        return this.getDataItem(element, 'Phone');
    }

    getDataItem (element, label) {
        return element.$(elements.container)
            .$$('.flex-item')
            .filter(el => el.$('.data-label').getText().toLowerCase() === label.toLowerCase())[0]
            .$('.read-only-data');
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

    get (element) {
        let contact = {
            full: this.getFull(element).getText(),
            title: this.getTitle(element).getText(),
            email: this.getEmail(element).getText(),
            phone: this.getPhone(element).getText(),
        };
        return contact;
    }

    set (contact) {
        this.editFull.setValue(contact.full);
        this.editTitle.setValue(contact.title);
        this.editEmail.setValue(contact.email);
        this.editPhone.setValue(contact.phone);
    }
}

export default ContactComponent;

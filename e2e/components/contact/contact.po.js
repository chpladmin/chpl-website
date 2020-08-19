const elements = {
    container: 'chpl-contact',
    editFull: '#contactFull',
    editTitle: '#contactTitle',
    editEmail: '#contactEmail',
    editPhone: '#contactPhoneNumber',
}

class ContactComponent {
    constructor () { }

    getFull (element) {
        return element.$(elements.container).$$('.flex-item')[1].$('.read-only-data');
    }

    getTitle (element) {
        return element.$(elements.container).$$('.flex-item')[0].$('.read-only-data');
    }

    getEmail (element) {
        return element.$(elements.container).$$('.flex-item')[2].$('.read-only-data');
    }

    getPhone (element) {
        return element.$(elements.container).$$('.flex-item')[3].$('.read-only-data');
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

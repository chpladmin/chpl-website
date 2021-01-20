const elements = {
    cancel: '//*[@ng-click="$ctrl.cancel()"]',
    surveillanceDetails: '.col-sm-12.ng-binding',
    requirementTable: '.table-condensed',
    inspectTitle: '#inspect-label',
    edit: '//*[@ng-click="$ctrl.editSurveillance()"]',
    startDate: '#start-date',
    endDate: '#end-date',
    surveillanceType: '#surveillance-type',
    siteSurveilled: '#sites-surveilled',
    save: '//button[text()=" Save"]',
    remove: '//*[@ng-click="$ctrl.deleteRequirement(req)"]',
    error: '.text-danger.text-left',
};

class EditComponent {
    constructor () { }

    get cancel () {
        return $(elements.cancel);
    }

    get surveillanceDetails () {
        return $(elements.surveillanceDetails);
    }

    get inspectTitle () {
        return $(elements.inspectTitle);
    }

    get editButton () {
        return $(elements.edit);
    }

    get startDate () {
        return $(elements.startDate);
    }

    get endDate () {
        return $(elements.endDate);
    }

    get surveillanceType () {
        return $(elements.surveillanceType);
    }

    get siteSurveilled () {
        return $(elements.siteSurveilled);
    }

    get saveButton () {
        return $(elements.save);
    }

    get removeButton () {
        return $(elements.remove);
    }

    get errorMessages () {
        return $(elements.error);
    }

    requirementName (i) {
        return $(elements.requirementTable).$('tbody').$('tr').$$('td')[i];
    }

}

export default EditComponent;

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
    removeRequirement: '//*[@ng-click="$ctrl.deleteRequirement(req)"]',
    error: '.text-danger.text-left',
    newRequirement: '//*[@ng-click="$ctrl.addRequirement()"]',
    requirementType: '#requirement-type',
    requirementResult: '#result',
    newNonConformity: '//*[@ng-click="$ctrl.addNonconformity()"]',
    nonconformityType: '#nonconformity-type',
    nonconformityStatus: '#nonconformity-status',
    determinationDate: '#date-of-determination',
    summary: '#summary',
    findings: '#findings',
    editRequirement: '//*[@ng-click="$ctrl.editRequirement(req)"]',
    removeNonconformity: '//*[@ng-click="$ctrl.deleteNonconformity(noncon)"]',
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
        return $(elements.removeRequirement);
    }

    get errorMessages () {
        return $(elements.error);
    }

    get newRequirementButton () {
        return $(elements.newRequirement);
    }

    get requirementType () {
        return $(elements.requirementType);
    }

    get requirementResult () {
        return $(elements.requirementResult);
    }

    get newNonConformityButton () {
        return $(elements.newNonConformity);
    }

    get nonconformityType () {
        return $(elements.nonconformityType);
    }

    get nonconformityStatus () {
        return $(elements.nonconformityStatus);
    }

    get determinationDate () {
        return $(elements.determinationDate);
    }

    get summary () {
        return $(elements.summary);
    }

    get findings () {
        return $(elements.findings);
    }

    get editRequirement () {
        return $(elements.editRequirement);
    }

    get removeNonconformity () {
        return $(elements.removeNonconformity);
    }

    requirementTable () {
        return $(elements.requirementTable).$('tbody').$$('tr');
    }

    requirementName (i) {
        return $(elements.requirementTable).$('tbody').$('tr').$$('td')[i];
    }

    nonconformityTable () {
        return $('.table.ng-scope').$('tbody').$$('tr');
    }

}

export default EditComponent;

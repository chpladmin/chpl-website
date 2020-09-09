const elements = {
    root: 'chpl-direct-reviews',
    directReviews: '.direct-review',
    title: '.direct-review__header-title',
    subtitle: '.direct-review__header-subtitle',
    start: '.direct-review__start',
    end: '.direct-review__end',
    circumstances: '.direct-review__circumstances',
    drDataElement: '.direct-review__data-element',
    nonconformities: '.nonconformity__header',
    result: '.nonconformity__gridtable-header--last',
    basicInformation: '.nonconformity__basic-information',
    requirement: '.nonconformity__requirement',
    dal: '.nonconformity__dal',
    determination: '.nonconformity__determination',
    findings: '.nonconformity__findings',
    capApproval: '.nonconformity__cap-approval',
    capStart: '.nonconformity__cap-start',
    capMustComplete: '.nonconformity__cap-must-complete',
    explanation: '.nonconformity__explanation',
    capCompleted: '.nonconformity__cap-completed',
    resolution: '.nonconformity__resolution',
    ncDataElement: '.nonconformity__data-element',
    ncNoneFound: '.nonconformity__none-found',
};

class DirectReviewsComponent {
    constructor () { }

    get rootComponent () {
        return $(elements.root);
    }

    getDirectReviews () {
        let drs = $(elements.root).$$(elements.directReviews);
        if (drs && drs.length > 0) {
            return drs;
        }
        return $(elements.root);
    }

    getDirectReviewTitle (directReview) {
        return directReview.$(elements.title);
    }

    getDirectReviewSubtitle (directReview) {
        return directReview.$(elements.subtitle);
    }

    getDirectReviewBegan (directReview) {
        return directReview.$(elements.start).$(elements.drDataElement);
    }

    getDirectReviewEnded (directReview) {
        return directReview.$(elements.end).$(elements.drDataElement);
    }

    getDirectReviewCircumstances (directReview) {
        return directReview.$(elements.circumstances).$$('li');
    }

    getDirectReviewNonconformities (directReview) {
        let ncs = directReview.$$(elements.nonconformities);
        if (ncs && ncs.length > 0) {
            return ncs;
        }
        return directReview.$(elements.ncNoneFound);
    }

    getNonconformityResult (nonconformity) {
        return nonconformity.$(elements.result);
    }

    getNonconformityRequirement () {
        return $(elements.basicInformation).$(elements.requirement).$(elements.ncDataElement);
    }

    getNonconformityDeveloperAssociatedListings () {
        return $(elements.basicInformation).$(elements.dal).$$('li');
    }

    getNonconformityDateOfDetermination () {
        return $(elements.basicInformation).$(elements.determination).$(elements.ncDataElement);
    }

    getNonconformityFindings () {
        return $(elements.basicInformation).$(elements.findings).$(elements.ncDataElement);
    }

    getNonconformityCapApprovalDate () {
        return $(elements.basicInformation).$(elements.capApproval).$(elements.ncDataElement);
    }

    getNonconformityCapStartDate () {
        return $(elements.basicInformation).$(elements.capStart).$(elements.ncDataElement);
    }

    getNonconformityCapMustCompleteDate () {
        return $(elements.basicInformation).$(elements.capMustComplete).$(elements.ncDataElement);
    }

    getNonconformityDeveloperExplanation () {
        return $(elements.basicInformation).$(elements.explanation).$(elements.ncDataElement);
    }

    getNonconformityCapCompletedDate () {
        return $(elements.basicInformation).$(elements.capCompleted).$(elements.ncDataElement);
    }

    getNonconformityResolution () {
        return $(elements.basicInformation).$(elements.resolution).$(elements.ncDataElement);
    }
}

export default DirectReviewsComponent;

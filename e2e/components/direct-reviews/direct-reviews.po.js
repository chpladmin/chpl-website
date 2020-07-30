const elements = {
    root: 'div.direct-reviews',
    directReviews: '.direct-review',
    title: '.direct-review__header-title',
    subtitle: '.direct-review__header-subtitle',
    start: '.direct-review__start',
    end: '.direct-review__end',
    circumstances: '.direct-review__circumstances',
    dataElement: '.direct-review__data-element',
    nonconformities: '.nonconformity__header',
    result: '.nonconformity__gridtable-header--last',
}

class DirectReviewsComponent {
    constructor () { }

    get rootComponent () {
        return $(elements.root);
    }

    get directReviews () {
        return $(elements.root).$$(elements.directReviews);
    }

    getDirectReviewTitle (directReview) {
        return directReview.$(elements.title);
    }

    getDirectReviewSubtitle (directReview) {
        return directReview.$(elements.subtitle);
    }

    getDirectReviewBegan (directReview) {
        return directReview.$(elements.start).$(elements.dataElement);
    }

    getDirectReviewEnded (directReview) {
        return directReview.$(elements.end).$(elements.dataElement);
    }

    getDirectReviewCircumstances (directReview) {
        return directReview.$(elements.circumstances).$$('li');
    }

    getDirectReviewNonconformities (directReview) {
        return directReview.$$(elements.nonconformities);
    }

    getNonconformityResult (nonconformity) {
        return nonconformity.$(elements.result)
    }
}

export default DirectReviewsComponent;

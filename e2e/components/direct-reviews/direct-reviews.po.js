const elements = {
    root: 'div.direct-reviews',
    directReviews: '.direct-review',
    directReviewTitle: '.direct-review__header-title',
    directReviewSubtitle: '.direct-review__header-subtitle',
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
        return directReview.$(elements.directReviewTitle);
    }

    getDirectReviewSubtitle (directReview) {
        return directReview.$(elements.directReviewSubtitle);
    }
}

export default DirectReviewsComponent;

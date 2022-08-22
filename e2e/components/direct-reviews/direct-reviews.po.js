class DirectReviewsComponent {
  constructor() {
    this.elements = {
      root: 'chpl-direct-reviews-view-bridge',
      directReviews: '.direct-review',
    };
  }

  getDirectReviews() {
    const drs = $(this.elements.root).$$(this.elements.directReviews);
    if (drs && drs.length > 0) {
      return drs;
    }
    return $(this.elements.root);
  }
}

export default DirectReviewsComponent;

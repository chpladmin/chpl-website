class DirectReviewsComponent {
  constructor() {
    this.elements = {
      root: 'chpl-direct-reviews-view-bridge',
      directReviews: '.direct-review',
    };
  }

  async getDirectReviews() {
    const drs = await (await $(this.elements.root)).$$(this.elements.directReviews);
    if (drs && drs.length > 0) {
      return drs;
    }
    return $(this.elements.root);
  }
}

export default DirectReviewsComponent;

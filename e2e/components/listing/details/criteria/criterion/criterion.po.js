class CriterionComponent {
  constructor() {
    this.elements = {
      criterionHeader: async id => `#criterion-id-${id}-header`,
    };
  }

  async criterionHeader(id) {
    return $(await this.elements.criterionHeader(id)).$('h6');
  }
}

export default CriterionComponent;

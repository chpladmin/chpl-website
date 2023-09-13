class CriterionComponent {
  constructor() {
    this.elements = {
      criterionHeader: (id) => `#criterion-id-${id}-header`,
    };
  }

  criterionHeader(id) {
    return $(this.elements.criterionHeader(id)).$('h6');
  }
}

export default CriterionComponent;

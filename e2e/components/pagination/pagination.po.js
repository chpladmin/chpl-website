class PaginationComponent {
  constructor() {
    this.elements = {
      pagination: '.pagination--results-found',
    };
  }

  get pagination() {
    return $(this.elements.pagination);
  }
}

export default PaginationComponent;

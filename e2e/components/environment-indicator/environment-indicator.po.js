class EnvironmentIndicatorComponent {
  constructor() {
    this.elements = {
      nonProd: '#non-prod-indicator',
    };
  }

  get nonProdIndicator() {
    return $(this.elements.nonProd);
  }
}

export default EnvironmentIndicatorComponent;

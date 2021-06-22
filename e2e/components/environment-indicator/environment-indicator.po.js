class EnvironmentIndicatorComponent {
  constructor() {
    this.elements = {
      nonprod: '#non-prod-indicator',
    };
  }

  get nonProdIndicator() {
    return $(this.elements.nonprod);
  }
}

export default EnvironmentIndicatorComponent;

class EnvironmentIndicatorComponent {
  constructor() {
    this.elements = {
      nonprod: 'chpl-non-prod-indicator-bridge',
    };
  }

  get nonProdIndicator() {
    return $(this.elements.nonprod);
  }
}

export default EnvironmentIndicatorComponent;

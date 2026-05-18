const NavigationComponent = {
  template: '<chpl-navigation-top-bridge></chpl-navigation-top-bridge>',
  controller: class NavigationComponent {
    constructor($log) {
      'ngInject';

      this.$log = $log;
    }
  },
};

angular.module('chpl.navigation')
  .component('aiNavigationTop', NavigationComponent);

export default NavigationComponent;

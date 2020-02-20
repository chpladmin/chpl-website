class HighlightCuresDirective {
    constructor () {
        this.restrict = 'A';
        this.require = 'ngModel';
        this.replace = true;
        this.scope = {
            ngModel: '=',
        };
    }

    link (scope, element) {
        scope.$watch('ngModel', value => {
            let html = value.replace('(Cures Update)', '<span class="cures-update">(Cures Update)</span>');
            element.html(html);
        });
    }
}
angular
    .module('chpl.components')
    .directive('chplHighlightCures', () => new HighlightCuresDirective);

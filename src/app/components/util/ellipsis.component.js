(function () {
    'use strict';

    angular.module('chpl.components')
        .component('aiEllipsis', {
            templateUrl: 'chpl.components/util/ellipsis.html',
            controller: EllipsisController,
            bindings: {
                text: '@',
                maxLength: '@?',
                wordBoundaries: '@?',
            },
        });

    function EllipsisController () {
        this.$onInit = function () {
            this.displayText = this.text;
            this.isShortened = false;
            if (this.displayText.length > this.maxLength) {
                this.displayText = this.text.substring(0, this.maxLength);
                this.isShortened = true;
                if (this.wordBoundaries) {
                    var parts = this.displayText.split(' ');
                    parts.splice(parts.length - 1, 1);
                    if (parts.length > 0) {
                        this.displayText = parts.join(' ');
                    }
                }
            }
        }
    }
})();

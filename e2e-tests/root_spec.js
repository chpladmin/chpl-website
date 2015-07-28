'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('chpl-website', function() {

    it('should automatically redirect to /search when location hash/fragment is empty', function() {
        browser.get('index.html');
        expect(browser.getLocationAbsUrl()).toMatch("/search");
    });

    describe('privacy view', function () {

        beforeEach (function () {
            browser.get('index.html#/privacy');
        });

        it('should render privacy policy when user navigates to /privacy', function () {
            expect(element.all(by.css('[ng-view] h1')).first().getText())
                .toMatch('Privacy policy');
        });

        it('should have multiple paragraphs', function () {
            expect(element.all(by.css('[ng-view] p')).count())
                .toBeGreaterThan(2);
        });
    });
});

;(function () {
    'use strict';

    /* https://github.com/angular/protractor/blob/master/docs/toc.md */

//    describe('chpl-website', function() {

        describe('chpl-website.search view', function () {
            beforeEach(function () {
                browser.get('index.html#/search');
            });

            it('should render search page when user navigates to /search', function () {
                expect(element.all(by.css('[ng-view] h1')).first().getText())
                    .toMatch('Welcome to the CHPL');
            });

            it('should have results when searching for a blank string', function () {
                var searchBox = element(by.id('searchField'));
                searchBox.clear();

                var searchButton = element(by.id('searchButton'));
                searchButton.click();

                expect(element(by.id('resultsSection')).element(by.tagName('h2')).getText())
                    .toMatch('Results');
            });

            it('should typeahead in the search box and autocomplete on TAB', function () {
                var searchBox = element(by.id('searchField'));
                searchBox.sendKeys('lorem');
                searchBox.sendKeys(protractor.Key.TAB);

                searchBox.getAttribute('value')
                    .then(function (value) {
                        expect(value.length).toBeGreaterThan(5);
                    });
            });
  //      });
    });
})();

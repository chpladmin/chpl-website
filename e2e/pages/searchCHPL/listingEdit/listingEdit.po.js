class ListingEditPage {
    constructor () { }

    get editcertifiedProduct () {
        return $('#inspect-edit');
    }

    get testProcedureName () {
        return $('//*[@id="testProcedures "]');
    }

    get allTestProcedureVersion () {
        return $$('*[id^="testProcedures-additional-input"]');
    }

    get testToolsName () {
        return $('//*[@id="testTools "]');
    }

    get alltestToolsVersion () {
        return $$('*[id^="testTools-additional-input"]');
    }

    get testDataName () {
        return $('//*[@id="testData "]');
    }

    get alltestDataVersion () {
        return $$('*[id^="testData-additional-input"]');
    }

    get testFunctionalityName () {
        return $('*[id="testFunctionality "]');
    }

    get saveCertifiedProduct () {
        return $('button=Save Certification Criteria');
    }

    get closeListingEditButton () {
        return $('button.close.pull-right.ng-isolate-scope');
    }

    get yesConfirmation () {
        return $('//button[text()="Yes"]');
    }

    gotoEditCriteria (editCriteriaId , cures) {
        this.editcertifiedProduct.click();
        if (cures === true) {
            //click on Edit for on the criteria
            $('//*[@id="criteria_' + editCriteriaId + '_details_header_cures"]/span[3]/span/button/i').click();
        }
        else {
            $('//*[@id="criteria_' + editCriteriaId + '_details_header"]/span[3]/span/button/i').click();
        }
    }

    selectTestProcedures (name , version) {
        this.testProcedureName.selectByVisibleText(name);
        const totalTestProc = this.allTestProcedureVersion.length;
        //This will get latest added test procedure version text box
        $('//*[@id="testProcedures-additional-input-' + (totalTestProc - 1) + '"]').addValue(version);
    }

    selectTestFunctionality (name) {
        this.testFunctionalityName.selectByVisibleText(name);
    }

    selectTestData (name , version) {
        this.testDataName.selectByVisibleText(name);
        const totalTestData = (this.alltestDataVersion.length) / 2;
        //This will get latest added test data version text box, alteration has same id so this below locator is different than test proc, tools
        $('//*[@id="testData-additional-input-' + (totalTestData - 1) + '"]').addValue(version);
    }

    selectTestTools (name , version) {
        this.testToolsName.selectByVisibleText(name);
        const totalTestTools = this.alltestToolsVersion.length;
        //This will get latest added test tools version text box
        $('//*[@id="testTools-additional-input-' + (totalTestTools - 1) + '"]').addValue(version);
    }

    removeTestProcToolData (name) {
        $('//span[text()="' + name + '"]/parent::button').click();
    }

    viewDetailsCriteria (criteriaId , cures) {
        if (cures === true) {
            //click on Edit for on the criteria
            $('//*[@id="criteria_' + criteriaId + '_details_link_cures"]').waitAndClick();
        }
        else {
            $('//*[@id="criteria_' + criteriaId + '_details_link"]').waitAndClick();
        }
    }

    closeEditListing () {
        this.closeListingEditButton.waitAndClick();
        this.yesConfirmation.waitAndClick();
        this.closeListingEditButton.waitAndClick();
        this.yesConfirmation.waitAndClick();
    }

    getTestFunctionalityDetail (criteriaId , cures) {
        if (cures === true) {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Functionality_Tested_cures"]');
        }
        else {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Functionality_Tested"]');
        }
    }

    getTestDataDetail (criteriaId , cures) {
        if (cures === true) {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Test_data_cures"]');
        }
        else {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Test_data"]');
        }
    }

    getTestToolDetail (criteriaId , cures) {
        if (cures === true) {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Test_tool_cures"]');
        }
        else {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Test_tool"]');
        }
    }

    getTestProcedureDetail (criteriaId , cures) {
        if (cures === true) {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Test_procedure_cures"]');
        }
        else {
            return $('//*[@id="criteria_' + criteriaId + '_details_row_Test_procedure"]');
        }
    }
}

export default ListingEditPage;

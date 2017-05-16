#features/components/resources/download.feature
Feature: Downloading data from CHPL
  As a user of the CHPL, I should be able to download data definition files, in order to know what's in the download files

  Scenario: Seeing the Download page
    Given I am on the Resources-Download page
    Then I should see "Download the CHPL" as the visible page title
    And the browser page title should be "Download the CHPL"

  Scenario: Unauthenticated users have 8 download files
    Given I am on the CHPL
    And I am not logged in
    When I am on the Resources-Download page
    Then there should be 8 Download Files

  Scenario: Authenticated users have 9 download files
    Given I am on the Resources-Download page
    And I am logged in as "ROLE_ADMIN"
    When I refresh the page
    Then there should be 9 Download Files

  @ignore
  Scenario: Seeing a data definition file select
    Given I am on the Resources-Download page
    Then there should be 8 Definition Files

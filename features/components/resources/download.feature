#features/components/resources/download.feature
Feature: Downloading data from CHPL
  As a user of the CHPL
  I should be able to download data definition files
  In order to know what's in the download files

  Scenario: Seeing the Download page
    Given I am on the Resources-Download page
    Then I should see 'Download the CHPL' as the page title

  Scenario: Seeing the download file select
    Given I am on the Resources-Download page
    Then There should be 8 Download Files

  @wip
  Scenario: Seeing a data definition file select
    Given I am on the Resources-Download page
    Then There should be 8 Definition Files

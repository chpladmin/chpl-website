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

  Scenario: Seeing a data definition file select
    Given I am on the CHPL
    And I am not logged in
    When I am on the Resources-Download page
    Then there should be 8 Definition Files

  Scenario: Authenticated users have 9 definition files
    Given I am on the Resources-Download page
    And I am not logged in
    When I am logged in as "ROLE_ADMIN"
    And I refresh the page
    Then there should be 9 Definition Files

  Scenario: Starting situation of Download & Definition select boxes
    Given I am on the Resources-Download page
    Then the download select box should be "Complete listing (xml)"
    And the definition select box should be "Complete listing (xml) Definition File"

  Scenario Outline: Changing the download file to "<download>"
    Given I am on the Resources-Download page
    When I change the download file select box to "<download>"
    Then the definition select box should be "<definition>"

    Examples:
      |download                   |definition                                 |
      |2015 edition products (xml)|2015 edition products (xml) Definition File|
      |2014 edition products (xml)|2014 edition products (xml) Definition File|
      |2011 edition products (xml)|2011 edition products (xml) Definition File|
      |2015 edition summary (csv) |2015 edition summary (csv) Definition File |
      |2014 edition summary (csv) |2014 edition summary (csv) Definition File |
      |Surveillance Activity      |Surveillance Activity Definition File      |
      |Non-Conformities           |Non-Conformities Definition File           |

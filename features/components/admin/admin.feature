Feature: Administration of the CHPL
  As an authenticated user of the CHPL, there should be an admin section, so I can administer the CHPL

  Scenario: Seeing the Administration Title
    Given I am on the Administration page
    Then the browser page title should be "CHPL Administration"

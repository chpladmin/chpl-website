#features/components/admin/admin.feature
@ignore
Feature: Administration of the CHPL
  As an authenticated user of the CHPL
  I should be able to log in
  in order to administer the CHPL

  Scenario: Seeing the Administration Title
    Given I am on the Administration page
    Then the page title should be "CHPL Administration"

  Scenario: Logging in as ROLE_ADMIN
    Given I am on the Administration page
    When I log in as ROLE_ADMIN
    Then the login form should go away

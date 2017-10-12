Feature: CHPL Admin Navigation
  As an admin of the CHPL, I should be able to navigate, so I can get to things on CHPL

  Scenario: Getting admin navigation options
    Given I am on the CHPL
    And I am logged in as "ROLE_ADMIN"
    Then the admin navigation should have 10 elements

  Scenario: Getting ACB admin navigation options
    Given I am on the CHPL
    And I am logged in as "ROLE_ACB_ADMIN"
    Then the admin navigation should have 5 elements

  Scenario: Seeing my name on the navigation toggle
    Given I am on the CHPL
    And I am logged in as "ROLE_ADMIN"
    Then the admin navigation button text should be "Administrator Administrator"

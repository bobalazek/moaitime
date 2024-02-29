/// <reference types="cypress" />

describe('social.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('social--open-button').should('exist');
  });

  it('should close social', () => {
    cy.getBySel('social--open-button').click();

    cy.getBySel('social--index').find('[data-test="social--header--home-button"]').click();

    cy.getBySel('social--index').should('not.exist');
  });

  it('should go to user search in social', () => {
    cy.getBySel('social--open-button').click();

    cy.getBySel('social--index').find('[data-test="social--header--open-user-search"]').click();

    cy.getBySel('social--user-search').should('exist');
  });

  it('should go to user profile in social', () => {
    cy.getBySel('social--open-button').click();

    cy.getBySel('social--index').find('[data-test="social--header--user-profile--dropdown-menu--trigger-button"]').click();

    cy.getBySel('social--header--user-profile--dropdown-menu')
    .find('a[role="menuitem"]')
    .contains('Profile')
    .click();

    cy.getBySel('social--users-view--content').should('exist');
  });

  it('should go to notifications in social', () => {
    cy.getBySel('social--open-button').click();

    cy.getBySel('social--index').find('[data-test="social--header--user-profile--dropdown-menu--trigger-button"]').click();

    cy.getBySel('social--header--user-profile--dropdown-menu')
    .find('a[role="menuitem"]')
    .contains('Notifications')
    .click();

    cy.getBySel('notifications--content').should('exist');
  });

  it('should go to settings in social', () => {
    cy.getBySel('social--open-button').click();

    cy.getBySel('social--index').find('[data-test="social--header--user-profile--dropdown-menu--trigger-button"]').click();

    cy.getBySel('social--header--user-profile--dropdown-menu')
    .find('div[role="menuitem"]')
    .contains('Settings')
    .click();

    cy.getBySel('settings--dialog').should('exist');
  });

  it('should logout the user in social', () => {
    cy.getBySel('social--open-button').click();

    cy.getBySel('social--index').find('[data-test="social--header--user-profile--dropdown-menu--trigger-button"]').click();

    cy.getBySel('social--header--user-profile--dropdown-menu')
    .find('div[role="menuitem"]')
    .contains('Logout')
    .click();

    cy.get('div').contains('Sign In').should('exist');
  });

});

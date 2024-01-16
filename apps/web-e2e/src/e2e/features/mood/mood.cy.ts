/// <reference types="cypress" />

describe('mood.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('mood--open-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('mood--open-button').should('exist');

    cy.toggleSettingsSwitch('Mood', { moodEnabled: false });

    cy.getBySel('mood--open-button').should('not.exist');
  });

  it('should open mood', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood').should('exist');
  });

  it('should close mood', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood').find('[data-test="mood--header--home-button"]').click();

    cy.getBySel('mood').should('not.exist');
  });

  it('should add new mood entry', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood--header--add-new-mood-button').click();

    cy.getBySel('mood--mood-entry-edit-dialog').should('exist');

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('great').click();

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('mood--mood-entry').should('exist');
  });
});

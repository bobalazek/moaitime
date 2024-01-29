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

  it('should add a note to new mood entry', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood--header--add-new-mood-button').click();

    cy.getBySel('mood--mood-entry-edit-dialog').should('exist');

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('great').click();

    cy.getBySel('mood--mood-entry-edit-dialog')
      .find('[id="moodEntry-note"]')
      .type("I'm feeling great!");

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('mood--mood-entry--note').contains("I'm feeling great!");
  });

  it.skip('should edit mood entry', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood--header--add-new-mood-button').click();

    cy.getBySel('mood--mood-entry-edit-dialog').should('exist');

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('great').click();

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('mood--mood-entry').should('exist');

    cy.getBySel('mood--mood-entry--actions-dropdown-menu--trigger-button').click();

    cy.getBySel('mood--mood-entry--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Edit')
      .click();

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('bad').click();

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();
  });

  it('should delete mood entry', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood--header--add-new-mood-button').click();

    cy.getBySel('mood--mood-entry-edit-dialog').should('exist');

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('great').click();

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('mood--mood-entry').should('exist');

    cy.getBySel('mood--mood-entry--actions-dropdown-menu--trigger-button').click();

    cy.getBySel('mood--mood-entry--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Delete')
      .click();

    cy.getBySel('mood--mood-entry').should('not.exist');
  });

  it('should check if success message is displayed when adding mood entry', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood--header--add-new-mood-button').click();

    cy.getBySel('mood--mood-entry-edit-dialog').should('exist');

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('great').click();

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();

    cy.hasToastWithText('You have successfully saved the mood entry.');
  });

  it('should check if success message is displayed when deleting mood entry', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood--header--add-new-mood-button').click();

    cy.getBySel('mood--mood-entry-edit-dialog').should('exist');

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('great').click();

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('mood--mood-entry--actions-dropdown-menu--trigger-button').click();

    cy.getBySel('mood--mood-entry--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Delete')
      .click();

    cy.hasToastWithText('The mood entry was successfully deleted!');
  });

  it('should undo delete mood entry if undo in toast is clicked', () => {
    cy.getBySel('mood--open-button').click();

    cy.getBySel('mood--header--add-new-mood-button').click();

    cy.getBySel('mood--mood-entry-edit-dialog').should('exist');

    cy.getBySel('mood--mood-entry-edit-dialog--scores').contains('great').click();

    cy.getBySel('mood--mood-entry-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('mood--mood-entry--actions-dropdown-menu--trigger-button').click();

    cy.getBySel('mood--mood-entry--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Delete')
      .click();

    cy.getToastsContainer().find('button').contains('Undo').click({ force: true });

    cy.getBySel('mood--mood-entry').should('exist');
  });
});

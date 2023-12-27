/// <reference types="cypress" />

describe('notes.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('notes--open-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('notes--open-button').should('exist');

    cy.toggleSettingsSwitch('Notes', { notesEnabled: false });

    cy.getBySel('notes--open-button').should('not.exist');
  });

  it('should open notes', () => {
    cy.getBySel('notes--open-button').click();

    cy.getBySel('notes').should('exist');
  });

  it('should close notes', () => {
    cy.getBySel('notes--open-button').click();

    cy.getBySel('notes').should('exist');

    cy.getBySel('notes').find('[data-test="notes--header--home-button"]').click();

    cy.getBySel('notes').should('not.exist');
  });

  it.skip('should add new note in notes main', () => {
    cy.getBySel('notes--open-button').click();

    cy.getBySel('notes').should('exist');

    cy.getBySel('notes--main').find('button').contains('Add new note').click();

    cy.get('input[placeholder="Title"]').click();

    cy.wait(1000);

    cy.get('input[placeholder="Title"]').type('First Note');

    cy.get('div[role="textbox"]').click().type('This is the first note description.');

    cy.getBySel('notes--header').find('button').contains('Create Note').click();
  });
});

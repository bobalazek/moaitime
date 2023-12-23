/// <reference types="cypress" />

describe('commands.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('commands-trigger-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('commands-trigger-button').should('exist');

    cy.toggleSettingsSwitch('Commands', { commandsEnabled: false });

    cy.getBySel('commands-trigger-button').should('not.exist');
  });

  it('should open commands dialog on click', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.getBySel('commands--dialog').should('exist');
  });

  it('should exit commands dialog on click', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.getBySel('commands--dialog').find('button').first().click();

    cy.getBySel('commands--dialog').should('not.exist');
  });

  it('should exit commands dialog if we click outside the popover', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.getBySel('commands--dialog').should('exist');

    cy.clickOutside();

    cy.getBySel('commands--dialog').should('not.exist');
  });

  it('should open Tasks from commands dialog', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.get('[data-value="open tasks"]').click();

    cy.getBySel('tasks--popover').should('exist');
  });

  it('should open add New List from commands dialog', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.get('[data-value="new list"]').click();

    cy.getBySel('tasks--list-edit-dialog').should('exist');
  });

  it('should open Open Inbox List from commands dialog', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.get('[data-value="open inbox list"]').click();

    cy.getBySel('tasks--body-header').contains('Inbox').should('exist');
  });

  it('should open Calendar from commands dialog', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.get('[data-value="open calendar"]').click();

    cy.getBySel('calendar').should('exist');
  });

  it('should open Weather from commands dialog', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.get('[data-value="open weather"]').click();

    cy.getBySel('weather--popover').should('exist');
  });

  it('should open Settings from commands dialog', () => {
    cy.getBySel('commands-trigger-button').click();

    cy.get('[data-value="open settings"]').click();

    cy.getBySel('settings--dialog').should('exist');
  });
});

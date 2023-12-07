/// <reference types="cypress" />

describe('tasks.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('tasks--popover--trigger-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('tasks--popover--trigger-button').should('exist');

    cy.toggleSettingsSwitch('Tasks', { tasksEnabled: false });

    cy.getBySel('tasks--popover--trigger-button').should('not.exist');
  });

  it('should open the popover once you click on the trigger button', () => {
    // Make sure it does NOT exist initially
    cy.getBySel('tasks--popover').should('not.exist');

    // Open the tasks popover
    cy.getBySel('tasks--popover--trigger-button').click();

    // After the click it should now exist in the DOM
    cy.getBySel('tasks--popover').should('exist');
  });

  it('should hide if we click outside the popover', () => {
    cy.getBySel('tasks--popover--trigger-button').click();

    cy.getBySel('tasks--popover').should('exist');

    cy.clickOutside();

    // Make sure it does not exist anymore
    cy.getBySel('tasks--popover').should('not.exist');
  });
});

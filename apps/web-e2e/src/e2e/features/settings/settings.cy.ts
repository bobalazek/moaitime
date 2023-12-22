/// <reference types="cypress" />

describe('settings.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should open the dialog once you click on the trigger button', () => {
    cy.getBySel('settings--dialog').should('not.exist');

    cy.getBySel('settings--dialog--trigger-button').click();

    cy.getBySel('settings--dialog').should('exist');
  });

  it('should hide if we click outside the dialog', () => {
    cy.getBySel('settings--dialog').should('not.exist');

    cy.getBySel('settings--dialog--trigger-button').click();

    cy.getBySel('settings--dialog').should('exist');

    cy.clickOutside();

    // Make sure it does not exist anymore
    cy.getBySel('settings--dialog').should('not.exist');
  });

  it('should close the dialog if exit button is clicked', () => {
    cy.getBySel('settings--dialog').should('not.exist');

    cy.getBySel('settings--dialog--trigger-button').click();

    cy.getBySel('settings--dialog').should('exist');

    cy.getBySel('settings--dialog').find('button').last().click();

    cy.get('settings--dialog').should('not.exist');
  });

  it('should change Theme color from Light to Dark', () => {
    cy.getBySel('settings--dialog--trigger-button').click();

    cy.getBySel(`settings--dialog--sidebar`).find('button').contains('General').click();

    cy.get('#settings-generalTheme').click();

    cy.getBySel('general--settings--theme').find('div[role="option"]').contains('Dark').click();

    cy.get('body').should('have.class', 'dark');
  });
});

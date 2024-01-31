/// <reference types="cypress" />

describe('quote.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('quote').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('quote').should('exist');

    cy.toggleSettingsSwitch('Widgets', { quoteEnabled: false });

    cy.getBySel('quote').should('not.exist');
  });
});

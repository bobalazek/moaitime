/// <reference types="cypress" />

describe('search.cy.ts', () => {
  before(() => {
    cy.reloadDatabase();
  });

  beforeEach(() => {
    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('search').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('search').should('exist');

    cy.toggleSettingsSwitch('Search', { searchEnabled: false });

    cy.getBySel('search').should('not.exist');
  });

  it('should switch to a different search engine', () => {
    cy.getBySel('search').should('exist');

    cy.getBySel('search').find('button').click();

    cy.getBySel('search-engine-dropdown-menu').should('exist');

    cy.getBySel('search-engine-dropdown-menu')
      .find('div[role="group"]')
      .find('div[role="menuitemradio"]')
      .contains('Bing')
      .click();

    cy.getBySel('search-engine-dropdown-menu-trigger-button')
      .find('img')
      .should('have.attr', 'src')
      .should('include', 'bing');
  });
});

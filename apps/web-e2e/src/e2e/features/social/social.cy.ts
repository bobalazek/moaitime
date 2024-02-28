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

});

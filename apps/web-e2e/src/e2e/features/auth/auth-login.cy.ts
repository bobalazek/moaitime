/// <reference types="cypress" />

describe('auth-login.cy.ts', () => {
  before(() => {
    cy.reloadDatabase();
  });

  it('should login correctly', () => {
    cy.visit('/');

    cy.location('pathname').should('eq', '/login');

    cy.login();

    cy.location('pathname').should('eq', '/');
  });

  it('should display an error if all fields are not filled correctly', () => {
    cy.visit('/');

    cy.location('pathname').should('eq', '/login');

    cy.get('#login-button').click();

    cy.hasToastWithText('Invalid credentials');
  });

  it('should stay on the login page if all fields are not filled correctly', () => {
    cy.visit('/');

    cy.location('pathname').should('eq', '/login');

    cy.get('#login-button').click();

    cy.location('pathname').should('eq', '/login');
  });
});

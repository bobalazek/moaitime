/// <reference types="cypress" />

describe('auth-forgot-password.cy.ts', () => {
  before(() => {
    cy.reloadDatabase();
  });

  it('should open Forgot Password page', () => {
    cy.visit('/');

    cy.location('pathname').should('eq', '/login');

    cy.get('a').contains('Forgot Password?').click();

    cy.location('pathname').should('eq', '/forgot-password');
  });

  it('should display an error if Email is not filled', () => {
    cy.visit('/');

    cy.get('a').contains('Forgot Password?').click();

    cy.get('#forgotPassword-button').click();

    cy.contains('User not found').should('exist');
  });

  it('should display an error if Email is not correct', () => {
    cy.visit('/');

    cy.get('a').contains('Forgot Password?').click();

    cy.get('#forgotPassword-email').type('test');

    cy.get('#forgotPassword-button').click();

    cy.contains('User not found').should('exist');
  });

  it('should go back to Login page when clicking Back to Login', () => {
    cy.visit('/');

    cy.get('a').contains('Forgot Password?').click();

    cy.get('button').contains('Back to Login').click();

    cy.location('pathname').should('eq', '/login');
  });
});

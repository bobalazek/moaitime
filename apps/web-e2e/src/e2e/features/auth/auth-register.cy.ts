/// <reference types="cypress" />

describe('auth-register.cy.ts', () => {
  before(() => {
    cy.reloadDatabase();
  });

  it('should register and get the verification email correctly', () => {
    cy.visit('/register');

    cy.get('#register-displayName').type('NewTester');
    cy.get('#register-username').type('newtester');
    cy.get('#register-email').type('newtester@moaitime.com');
    cy.get('#register-password').type('password');
    cy.get('#register-terms').click();

    cy.intercept('POST', '/api/v1/auth/register').as('register');

    cy.get('#register-button').click();

    cy.wait('@register');

    cy.getNewestEmail().then((response) => {
      // the data object here is basically:
      // {
      //   id: string,
      //   createdAt: string,
      //   updatedAt: string,
      //   data: { from: string, to: string, subject: string, text: string, html: string }
      // }
      const { data } = response.body;

      expect(data).to.not.be.null;
      expect(data.data.to).eq('newtester@moaitime.com');
      expect(data.data.subject).includes('Welcome to');
      expect(data.data.html).includes('/confirm-email?token='); // We want to make sure that the email includes the verify email link
    });
  });
});

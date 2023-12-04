describe('app.cy.ts', () => {
  beforeEach(() => cy.visit('/'));

  it('should have the dark class in the <body> element', () => {
    cy.get('body').should('have.class', 'dark');
  });
});

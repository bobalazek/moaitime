/// <reference types="cypress" />

export function openNotes() {
  cy.getBySel('notes').should('not.exist');

  cy.getBySel('notes--open-button').click();

  cy.getBySel('notes').should('exist');
}

export function addNote() {
  cy.getBySel('notes--main').find('button').contains('Add new note').click();

  cy.getBySel('note-editor--title').click();

  cy.wait(1000);

  cy.getBySel('note-editor--title').type('First Note');

  cy.getBySel('note-editor--content').click().type('This is the first note description.');

  cy.getBySel('notes--header').find('button').contains('Create Note').click();
}

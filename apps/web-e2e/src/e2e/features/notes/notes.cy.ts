/// <reference types="cypress" />

import { addNote, openNotes } from '../../../support/utils/notes-helpers';

describe('notes.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should be shown by default', () => {
    cy.getBySel('notes--open-button').should('exist');
  });

  it('should be hidden if disabled in the settings', () => {
    cy.getBySel('notes--open-button').should('exist');

    cy.toggleSettingsSwitch('Notes', { notesEnabled: false });

    cy.getBySel('notes--open-button').should('not.exist');
  });

  it('should open notes', () => {
    openNotes();
  });

  it('should close notes', () => {
    openNotes();

    cy.getBySel('notes').find('[data-test="notes--header--home-button"]').click();

    cy.getBySel('notes').should('not.exist');
  });

  it('should add new note in notes main', () => {
    openNotes();

    addNote();

    cy.hasToastWithText('You have successfully saved the note!');

    cy.getBySel('notes--note').contains('First Note');
  });

  it('should add new note in notes sidebar', () => {
    openNotes();

    cy.getBySel('notes--sidebar--add-new-note-button').click();

    cy.getBySel('note-editor--title').click();

    cy.wait(1000);

    cy.getBySel('note-editor--title').type('First Note');

    cy.getBySel('note-editor--content').click().type('This is the first note description.');

    cy.getBySel('notes--header').find('button').contains('Create Note').click();

    cy.hasToastWithText('You have successfully saved the note!');

    cy.getBySel('notes--note').contains('First Note');
  });

  it('should show message unsaved changes if there are unsaved changes', () => {
    openNotes();

    cy.getBySel('notes--sidebar--add-new-note-button').click();

    cy.getBySel('note-editor--title').click();

    cy.wait(1000);

    cy.getBySel('note-editor--title').type('First Note');

    cy.getBySel('notes--header').find('div').contains('(unsaved)');

    // Show alert if canceling unsaved changes
    const stub = cy.stub();
    cy.on('window:confirm', stub);
    cy.getBySel('notes--header')
      .find('button')
      .contains('Cancel')
      .click()
      .then(() => {
        expect(stub.getCall(0)).to.be.calledWith(
          'You have unsaved changes. Are you sure you want to stop editing this note?'
        );
      });
  });

  it('should show message that note content must be provided', () => {
    openNotes();

    cy.getBySel('notes--sidebar--add-new-note-button').click();

    cy.getBySel('note-editor--title').click();

    cy.wait(1000);

    cy.getBySel('note-editor--title').type('First Note');

    cy.getBySel('notes--header').find('button').contains('Create Note').click();

    cy.hasToastWithText('Note content must be provided');
  });

  it('should cancel add new note if cancel button is clicked', () => {
    openNotes();

    cy.getBySel('notes--sidebar--add-new-note-button').click();

    cy.getBySel('note-editor').should('exist');

    cy.getBySel('notes--header').find('button').contains('Cancel').click();

    cy.getBySel('notes--main').contains('No note selected');
  });

  it('should delete note', () => {
    openNotes();

    addNote();

    cy.getBySel('notes--header--note-actions--dropdown-menu--trigger-button').click();

    cy.wait(5000);

    cy.getBySel('notes--header--note-actions--dropdown-menu')
      .find('div[role="menuitem"] span')
      .contains('Delete')
      .click({ force: true });

    cy.hasToastWithText('You have successfully deleted the note!');
  });

  it('should undo delete note', () => {
    openNotes();

    addNote();

    cy.getBySel('notes--header--note-actions--dropdown-menu--trigger-button').click();

    cy.getBySel('notes--header--note-actions--dropdown-menu')
      .find('div[role="menuitem"] span')
      .contains('Delete')
      .click({ force: true });

    cy.hasToastWithText('You have successfully deleted the note!');

    cy.get('section li').find('button').contains('Undo').click();

    cy.getBySel('notes--note').contains('First Note');
  });

  it('should hard delete note in note action dropdown menu', () => {
    openNotes();

    addNote();

    cy.getBySel('notes--header--note-actions--dropdown-menu--trigger-button').click();

    cy.getBySel('notes--header--note-actions--dropdown-menu')
      .find('div[role="menuitem"] span')
      .contains('Delete')
      .click({ force: true });

    cy.hasToastWithText('You have successfully deleted the note!');

    cy.getBySel('notes--sidebar--filters--dropdown-menu--trigger-button').click();

    cy.getBySel('notes--sidebar--filters--dropdown-menu')
      .find('div')
      .contains('Include deleted?')
      .click();

    cy.getBySel('notes--note').contains('First Note').click();

    cy.getBySel('notes--header--note-actions--dropdown-menu--trigger-button').click();

    cy.getBySel('notes--header--note-actions--dropdown-menu')
      .find('div[role="menuitem"] span')
      .contains('Hard Delete')
      .click({ force: true });

    cy.hasToastWithText('The note was successfully hard deleted!');
  });

  it('should undelete deleted note in note action dropdown menu', () => {
    openNotes();

    addNote();

    cy.getBySel('notes--header--note-actions--dropdown-menu--trigger-button').click();

    cy.getBySel('notes--header--note-actions--dropdown-menu')
      .find('div[role="menuitem"] span')
      .contains('Delete')
      .click({ force: true });

    cy.hasToastWithText('You have successfully deleted the note!');

    cy.getBySel('notes--sidebar--filters--dropdown-menu--trigger-button').click();

    cy.getBySel('notes--sidebar--filters--dropdown-menu')
      .find('div')
      .contains('Include deleted?')
      .click();

    cy.getBySel('notes--note').contains('First Note').click();

    cy.getBySel('notes--header--note-actions--dropdown-menu--trigger-button').click();

    cy.getBySel('notes--header--note-actions--dropdown-menu')
      .find('div[role="menuitem"] span')
      .contains('Undelete')
      .click({ force: true });

    cy.hasToastWithText('The note was successfully undeleted!');
  });
});

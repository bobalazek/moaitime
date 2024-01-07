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

    cy.getBySel('notes--header').find('div').contains('(unsaved changes)');

    // Show show alert if canceling unsaved changes
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
});

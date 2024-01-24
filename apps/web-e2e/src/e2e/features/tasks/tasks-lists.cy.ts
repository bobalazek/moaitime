/// <reference types="cypress" />

import {
  openTasksFirstListActions,
  openTasksNewListDropdownMenu,
  openTasksPopover,
} from '../../../support/utils/tasks-helpers';

describe('tasks-lists.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should switch to a different list', () => {
    openTasksPopover();

    cy.getBySel('tasks--body-header--lists-list--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--lists-list--dropdown-menu')
      .find('div[role="menuitemradio"]')
      .contains('Personal')
      .click();

    cy.getBySel('tasks--body-header--title').contains('Personal');
  });

  it('should delete the task list correctly', () => {
    openTasksPopover();

    openTasksFirstListActions();

    cy.getBySel('tasks--list-actions--dropdown-menu')
      .find('div[role="menuitem"] span')
      .contains('Delete')
      .click({ force: true });

    cy.get('div[role="alertdialog"]').find('button').contains('Confirm').click();

    cy.hasToastWithText('List deleted');
  });

  it('should edit the task list name', () => {
    openTasksPopover();

    openTasksFirstListActions();

    cy.getBySel('tasks--list-actions--dropdown-menu')
      .find('span')
      .contains('Edit')
      .click({ force: true });

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').click();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').clear();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').type('New list {enter}');

    cy.getBySel('tasks--list-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('tasks--body-header--title').contains('New list');
  });

  it('should check if successfull message is displayed after editing a task list name', () => {
    openTasksPopover();

    openTasksFirstListActions();

    cy.getBySel('tasks--list-actions--dropdown-menu')
      .find('span')
      .contains('Edit')
      .click({ force: true });

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').click();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').clear();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').type('New list {enter}');

    cy.getBySel('tasks--list-edit-dialog').find('button').contains('Save').click();

    cy.hasToastWithText('You have successfully saved the list.');
  });

  it('should edit and save the task list color', () => {
    // TODO: hacky workaround - should rather use
    // import { MAIN_COLORS } from '@moaitime/shared-common';
    // but not working at the moment
    const LIST_COLOR_OPTION = {
      name: 'Grey',
      value: '#6B7280',
    };

    openTasksPopover();

    openTasksFirstListActions();

    cy.getBySel('tasks--list-actions--dropdown-menu')
      .find('span')
      .contains('Edit')
      .click({ force: true });

    cy.wait(100);

    cy.getBySel('tasks--list-edit-dialog--color-select--trigger-button').click();

    cy.getBySel('tasks--list-edit-dialog--color-select')
      .find('div[role="option"]')
      .contains(LIST_COLOR_OPTION.name)
      .click();

    cy.getBySel('tasks--list-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('tasks--body-header--title').should(
      'have.attr',
      'data-color',
      LIST_COLOR_OPTION.value
    );
  });

  it('should check if add a new task list works correctly', () => {
    openTasksPopover();

    openTasksNewListDropdownMenu();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').type('New list {enter}');

    cy.getBySel('tasks--list-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('tasks--body-header--title').contains('New list');
  });

  it('should check if a successful message is displayed after adding a new task list', () => {
    openTasksPopover();

    openTasksNewListDropdownMenu();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').type('New list {enter}');

    cy.getBySel('tasks--list-edit-dialog').find('button').contains('Save').click();

    cy.hasToastWithText('You have successfully saved the list.');
  });

  it('should exit the add new task list dialog when clicking on the Close button', () => {
    openTasksPopover();

    openTasksNewListDropdownMenu();

    cy.getBySel('tasks--list-edit-dialog').find('div').contains('Close').click();

    cy.getBySel('tasks--list-edit-dialog').should('not.exist');
  });

  it('should exit the add new task list dialog when clicking on the x (close) button in the right top corner', () => {
    openTasksPopover();

    openTasksNewListDropdownMenu();

    cy.getBySel('tasks--list-edit-dialog').find('[data-test="dialog--close"]').click();

    cy.getBySel('tasks--list-edit-dialog').should('not.exist');
  });

  it('should move a task to another list', () => {
    openTasksPopover();

    cy.getBySel('tasks--body-header').contains('Unlisted');

    cy.getBySel('tasks--tasks-form').find('input').type('New task{enter}');

    cy.getBySel('tasks--task--actions-dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Move')
      .click();

    cy.getBySel('tasks--lists-list--dropdown-menu')
      .find('div[role="menuitemradio"]')
      .find('span')
      .contains('Personal')
      .click();

    cy.getBySel('tasks--body-header').contains('Personal');

    cy.getBySel('tasks--sortable-task').contains('New task');
  });

  it('should add color when creating a new task list', () => {
    // TODO: hacky workaround - should rather use
    // import { MAIN_COLORS } from '@moaitime/shared-common';
    // but not working at the moment
    const LIST_COLOR_OPTION = {
      name: 'Grey',
      value: '#6B7280',
    };

    openTasksPopover();

    cy.getBySel('tasks--body-header--lists-list--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--selected-list--dropdown-menu--add-new-button').click();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').click();

    cy.getBySel('tasks--list-edit-dialog').find('input[type="text"]').type('New list {enter}');

    cy.getBySel('tasks--list-edit-dialog--color-select--trigger-button').click();

    cy.getBySel('tasks--list-edit-dialog--color-select')
      .find('div[role="option"]')
      .contains(LIST_COLOR_OPTION.name)
      .click();

    cy.getBySel('tasks--list-edit-dialog').find('button').contains('Save').click();

    cy.getBySel('tasks--body-header--title').should(
      'have.attr',
      'data-color',
      LIST_COLOR_OPTION.value
    );
  });
});

/// <reference types="cypress" />

import { openTasksPopover } from '../../../support/utils/tasks-helpers';

describe('tasks-tasks.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should add a new task', () => {
    openTasksPopover();

    // Add a new task
    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    // Check if the new task is in the list
    cy.getBySel('tasks--task').should('exist');
  });

  it('should toggle the completed state when clicking on the checkbox', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task--completed-checkbox').click();

    cy.getBySel('tasks--task--completed-checkbox').should('have.attr', 'data-state', 'checked');

    cy.getBySel('tasks--task--completed-checkbox').click();

    cy.getBySel('tasks--task--completed-checkbox').should('have.attr', 'data-state', 'unchecked');
  });

  it('should edit task when double clicking on it', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').dblclick();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').clear();

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--name"]')
      .type('My edited task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--name"]')
      .should('have.text', 'My edited task');
  });

  it('should edit task when edit button is clicked', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Edit')
      .click();

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--name"]')
      .should('have.attr', 'contenteditable', 'true');
  });

  it('should delete task when delete button is clicked', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Delete')
      .click();

    cy.getBySel('tasks--task--name').should('not.exist');
  });

  it('should open expanded edit options for a task', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.getBySel('tasks--task-dialog').should('exist');
  });

  it('should edit task name in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.get('#task-name').clear();

    cy.get('#task-name').should('be.empty');

    cy.wait(100);

    cy.get('#task-name').type('Change task name');

    cy.get('button').contains('Save').click();

    cy.getBySel('tasks--tasks-list')
      .find('[data-test="tasks--task--name"]')
      .should('have.text', 'Change task name');
  });
  it('should add task description in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.get('#task-description').type('Task description.');

    cy.get('button').contains('Save').click();

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.get('#task-description').contains('Task description.');
  });

  it('should move task to another task list in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.getBySel('tasks--list-select--trigger-button').click();

    cy.getBySel('tasks--list-select').find('div').contains('Errands').click();

    cy.getBySel('tasks--list-select--trigger-button')
      .find('div')
      .contains('Errands')
      .should('exist');
  });

  it('should check if success message is displayed when clicking Save task in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.get('button').contains('Save').click();

    cy.contains('You have successfully saved the task').should('exist');
  });

  it('should close More dialog when clicking on Cancel', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.get('button').contains('Cancel').click();

    cy.getBySel('tasks--task-dialog').should('not.exist');
  });

  it('should close More dialog when clicking on the x (close) button in the right top corner in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.get('[data-test="dialog--close"]').click();

    cy.getBySel('tasks--task-dialog').should('not.exist');
  });

  it('should close More dialog when clicking outside the dialog', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('More')
      .click();

    cy.clickOutside();

    cy.getBySel('tasks--task-dialog').should('not.exist');
  });
});

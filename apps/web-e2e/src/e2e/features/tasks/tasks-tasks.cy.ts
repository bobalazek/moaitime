/// <reference types="cypress" />

import { openTasksPopover } from './utils/tasks-helpers';

describe('tasks-tasks.cy.ts', () => {
  before(() => {
    cy.reloadDatabase();
  });

  beforeEach(() => {
    cy.login();
  });

  it('should add a new task', () => {
    openTasksPopover();

    // Add a new task
    cy.getBySel('tasks--tasks-form').type('My new task{enter}');

    // Check if the new task is in the list
    cy.getBySel('tasks--task').should('exist');
  });

  it('should toggle the completed state when clicking on the checkbox', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').type('My new task{enter}');

    cy.getBySel('tasks--task--completed-checkbox').click();

    cy.getBySel('tasks--task--completed-checkbox').should('have.attr', 'data-state', 'checked');

    cy.getBySel('tasks--task--completed-checkbox').click();

    cy.getBySel('tasks--task--completed-checkbox').should('have.attr', 'data-state', 'unchecked');
  });

  it('should edit task when double clicking on it', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').type('My new task{enter}');

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').dblclick();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').clear();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').type('My edited task{enter}');

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').should('have.text', 'My edited task');
  });

  it('should edit task when edit button is clicked', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').type('My new task{enter}');

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]').click();

    cy.getBySel('tasks--task--actions-dropdown-menu').find('div[role="menuitem"]').contains('Edit').click();

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--name"]')
      .should('have.attr', 'contenteditable', 'true');
  });

  it('should delete task when delete button is clicked', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').type('My new task{enter}');

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]').click();

    cy.getBySel('tasks--task--actions-dropdown-menu').find('div[role="menuitem"]').contains('Delete').click();

    cy.getBySel('tasks--task--name').should('not.exist');
  });
});

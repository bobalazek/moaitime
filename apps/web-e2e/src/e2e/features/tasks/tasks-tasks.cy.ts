/// <reference types="cypress" />

import { addPriorityToMultipleTasks, openTasksPopover } from '../../../support/utils/tasks-helpers';

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

  it('should close task dialog when clicking on Cancel', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.get('button').contains('Cancel').click();

    cy.getBySel('tasks--task-edit-dialog').should('not.exist');
  });

  it('should close task dialog when clicking on the x (close) button in the right top corner in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.get('[data-test="dialog--close"]').click();

    cy.getBySel('tasks--task-edit-dialog').should('not.exist');
  });

  it('should close task dialog when clicking outside the dialog', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.clickOutside();

    cy.getBySel('tasks--task-edit-dialog').should('not.exist');
  });

  it('should toggle the completed state when clicking on the checkbox', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task--completed-checkbox').click();

    cy.getBySel('tasks--task--completed-checkbox').should('have.attr', 'data-state', 'checked');

    cy.getBySel('tasks--task--completed-checkbox').click();

    cy.getBySel('tasks--task--completed-checkbox').should('have.attr', 'data-state', 'unchecked');
  });

  it('should edit task text when double clicking on text', () => {
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

  it('should edit task text when edit button is clicked', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Edit Text')
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

  it('should undo delete task when undo is clicked in toast', () => {
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

    cy.getToastsContainer().find('button').contains('Undo').click({ force: true });

    cy.getBySel('tasks--task--name').contains('My new task');

    cy.hasToastWithText('The task was successfully undeleted!');
  });

  it('should open expanded edit options for a task', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.getBySel('tasks--task-edit-dialog').should('exist');
  });

  it('should edit task name in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.get('#task-name').clear();

    cy.wait(1000);

    cy.get('#task-name').type('Change task name');

    cy.wait(1000);

    cy.get('button').contains('Save').click();

    cy.getBySel('tasks--tasks-list')
      .find('[data-test="tasks--task--name"]')
      .should('have.text', 'Change task name');
  });

  it('should add task description in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.get('#task-description').type('Task description.');

    cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();

    cy.getBySel('tasks--task').first().click();

    cy.get('#task-description').contains('Task description.');
  });

  it('should open expanded edit options in task dropdown menu', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task--actions-dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Edit')
      .click({ force: true });

    cy.getBySel('tasks--task-edit-dialog').should('exist');
  });

  it('should move task to another task list in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.getBySel('list-selector--trigger-button').click();

    cy.getBySel('list-selector').find('div').contains('Errands').click();

    cy.getBySel('list-selector--trigger-button').find('div').contains('Errands').should('exist');
  });

  it('should add color to a task in expanded edit options', () => {
    const LIST_COLOR_OPTION = {
      name: 'Lime',
      value: '#84CC16',
    };
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.getBySel('tasks--task-edit-dialog--color-select--trigger-button').click();

    cy.getBySel('tasks--task-edit-dialog--color-select')
      .find('div[role="option"]')
      .contains(LIST_COLOR_OPTION.name)
      .click();

    cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();

    cy.wait(100);

    cy.getBySel('tasks--task').should('have.attr', 'data-task-color', LIST_COLOR_OPTION.value);
  });

  it('should check if success message is displayed when clicking Save task in expanded edit options', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.get('button').contains('Save').click();

    cy.hasToastWithText('You have successfully saved the task');
  });

  it('should add priority to a task in expanded edit options', () => {
    const LIST_COLOR_OPTION = {
      name: 'High',
      value: '#EF4444',
    };
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.getBySel('tasks--task-edit-dialog--priority-select--trigger-button').click();

    cy.getBySel('tasks--task-edit-dialog--priority-select')
      .find('div[role="option"]')
      .contains(LIST_COLOR_OPTION.name)
      .click();

    cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();

    cy.wait(100);

    cy.getBySel('tasks--task')
      .find('[data-test="tasks--task--priority-text"]')
      .contains('P1')
      .should('exist');
  });

  it('should add multiple tasks with priorities and sort them by priority', () => {
    openTasksPopover();

    addPriorityToMultipleTasks();

    cy.getBySel('tasks--task')
      .eq(0)
      .find('[data-test="tasks--task--priority-text"]')
      .contains('P1');

    cy.getBySel('tasks--task')
      .eq(1)
      .find('[data-test="tasks--task--priority-text"]')
      .contains('P2');

    cy.getBySel('tasks--task')
      .eq(2)
      .find('[data-test="tasks--task--priority-text"]')
      .contains('P3');
  });

  it('should duplicate task when duplicate button in task dropdown menu is clicked', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.getBySel('tasks--task')
      .first()
      .find('[data-test="tasks--task--actions-dropdown-menu--trigger-button"]')
      .click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Duplicate')
      .click();

    cy.getBySel('tasks--task--name').contains('My new task (copy)');
  });

  it('should add parent to a task', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.wait(1000);

    cy.getBySel('tasks--tasks-form').find('input').type('Parent task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.getBySel('task-parent-selector--trigger-button').click();

    cy.getBySel('task-parent-selector').contains('Parent task').click();

    cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();
  });

  it('should check that you can not add parent to a task that is already a parent', () => {
    openTasksPopover();

    cy.getBySel('tasks--tasks-form').find('input').type('My new task{enter}');

    cy.wait(1000);

    cy.getBySel('tasks--tasks-form').find('input').type('Parent task{enter}');

    cy.getBySel('tasks--task').first().click();

    cy.getBySel('task-parent-selector--trigger-button').click();

    cy.getBySel('task-parent-selector').contains('Parent task').click();

    cy.getBySel('tasks--task-edit-dialog').get('button').contains('Save').click();

    cy.getBySel('tasks--task').first().click();

    cy.getBySel('tasks--task-edit-dialog')
      .find('p')
      .contains(
        'A task with children cannot have a parent task. Please remove the children first.'
      );
  });
});

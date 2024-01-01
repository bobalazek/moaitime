/// <reference types="cypress" />

import { addMultipleTasks, openTasksPopover } from '../../../support/utils/tasks-helpers';

describe('tasks-filters.cy.ts', () => {
  beforeEach(() => {
    cy.reloadDatabase();

    cy.login();
  });

  it('should open the Filters dropdown menu', () => {
    cy.getBySel('tasks--popover--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu').should('exist');
  });

  it('should filter tasks by Order and Descending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Descending')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('bbb');

    cy.getBySel('tasks--task').eq(1).contains('ddd');

    cy.getBySel('tasks--task').eq(2).contains('aaa');

    cy.getBySel('tasks--task').eq(3).contains('ccc');
  });

  it('should filter tasks by Name and Ascending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Name')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('aaa');

    cy.getBySel('tasks--task').eq(1).contains('bbb');

    cy.getBySel('tasks--task').eq(2).contains('ccc');

    cy.getBySel('tasks--task').eq(3).contains('ddd');
  });

  it('should filter tasks by Name and Descending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Name')
      .click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Descending')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('ddd');

    cy.getBySel('tasks--task').eq(1).contains('ccc');

    cy.getBySel('tasks--task').eq(2).contains('bbb');

    cy.getBySel('tasks--task').eq(3).contains('aaa');
  });

  it('should filter tasks by Created At and Ascending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Created At')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('ccc');

    cy.getBySel('tasks--task').eq(1).contains('aaa');

    cy.getBySel('tasks--task').eq(2).contains('ddd');

    cy.getBySel('tasks--task').eq(3).contains('bbb');
  });

  it('should filter tasks by Created At and Descending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Created At')
      .click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Descending')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('bbb');

    cy.getBySel('tasks--task').eq(1).contains('ddd');

    cy.getBySel('tasks--task').eq(2).contains('aaa');

    cy.getBySel('tasks--task').eq(3).contains('ccc');
  });

  it('should filter tasks by Completed At and Ascending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--task--completed-checkbox').eq(2).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(0).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(3).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(1).click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Completed At')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('ddd');

    cy.getBySel('tasks--task').eq(1).contains('ccc');

    cy.getBySel('tasks--task').eq(2).contains('bbb');

    cy.getBySel('tasks--task').eq(3).contains('aaa');
  });

  it('should filter tasks by Completed At and Descending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--task--completed-checkbox').eq(2).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(0).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(3).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(1).click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Completed At')
      .click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Descending')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('aaa');

    cy.getBySel('tasks--task').eq(1).contains('bbb');

    cy.getBySel('tasks--task').eq(2).contains('ccc');

    cy.getBySel('tasks--task').eq(3).contains('ddd');
  });

  it('should filter tasks by Updated At and Ascending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').dblclick();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').clear();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').type('eee{enter}');

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Updated At')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('aaa');

    cy.getBySel('tasks--task').eq(1).contains('ddd');

    cy.getBySel('tasks--task').eq(2).contains('bbb');

    cy.getBySel('tasks--task').eq(3).contains('eee');
  });

  it('should filter tasks by Updated At and Descending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').dblclick();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').clear();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').type('eee{enter}');

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Updated At')
      .click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Descending')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('eee');

    cy.getBySel('tasks--task').eq(1).contains('bbb');

    cy.getBySel('tasks--task').eq(2).contains('ddd');

    cy.getBySel('tasks--task').eq(3).contains('aaa');
  });

  it('should filter tasks by Updated At and Descending', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').dblclick();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').clear();

    cy.getBySel('tasks--task').first().find('[data-test="tasks--task--name"]').type('eee{enter}');

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Updated At')
      .click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Descending')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('eee');

    cy.getBySel('tasks--task').eq(1).contains('bbb');

    cy.getBySel('tasks--task').eq(2).contains('ddd');

    cy.getBySel('tasks--task').eq(3).contains('aaa');
  });

  it('should filter tasks by Include deleted', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.wait(1000);

    cy.getBySel('tasks--task--actions-dropdown-menu--trigger-button').first().click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Delete')
      .click({ force: true });

    cy.wait(1000);

    cy.getBySel('tasks--task--actions-dropdown-menu--trigger-button').first().click();

    cy.getBySel('tasks--task--actions-dropdown-menu')
      .find('div[role="menuitem"]')
      .contains('Delete')
      .click({ force: true });

    cy.wait(1000);

    cy.getBySel('tasks--tasks-list').contains('ccc').should('not.exist');

    cy.getBySel('tasks--tasks-list').contains('aaa').should('not.exist');

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Include deleted?')
      .click();

    cy.wait(1000);

    cy.getBySel('tasks--task').eq(0).contains('ccc');

    cy.getBySel('tasks--task').eq(1).contains('aaa');

    cy.getBySel('tasks--task').eq(2).contains('ddd');

    cy.getBySel('tasks--task').eq(3).contains('bbb');
  });

  it('should filter tasks by Include completed (exlude completed)', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--task--completed-checkbox').eq(2).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(0).click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Include completed?')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('aaa');

    cy.getBySel('tasks--task').eq(1).contains('bbb');
  });

  it('should filter tasks by Include completed (toggle Include completed)', () => {
    openTasksPopover();

    addMultipleTasks();

    cy.getBySel('tasks--task--completed-checkbox').eq(2).click();

    cy.getBySel('tasks--task--completed-checkbox').eq(0).click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Include completed?')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('aaa');

    cy.getBySel('tasks--task').eq(1).contains('bbb');

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu--trigger-button').click();

    cy.getBySel('tasks--body-header--list-selector--dropdown-menu')
      .find('div')
      .contains('Include completed?')
      .click();

    cy.getBySel('tasks--task').eq(0).contains('ccc');

    cy.getBySel('tasks--task').eq(1).contains('aaa');

    cy.getBySel('tasks--task').eq(2).contains('ddd');

    cy.getBySel('tasks--task').eq(3).contains('bbb');
  });
});
